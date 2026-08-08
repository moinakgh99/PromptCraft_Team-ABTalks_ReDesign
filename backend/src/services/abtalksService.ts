import { globalStore, Store } from "./store.js";
import {
  Student,
  Challenge,
  Submission,
  AchievementWithStatus,
  LeaderboardEntry,
  AICoachInsight,
  SubmitChallengePayload,
  SubmitChallengeResult,
  UpdateProfilePayload,
  StudentProfileResponse,
  HeatmapEntry,
  APIError,
  Achievement,
  RewardOutcome,
  TrackType
} from "../types/index.js";
import {
  calculateSubmissionXP,
  calculateLevel,
  evaluateStreakState,
  computeNewStreakOnSubmission,
  calculateRecruiterScore,
  evaluateAchievements,
  selectDailyReward,
  validateSubmissionURLs,
  getSystemDate,
  formatDateYYYYMMDD
} from "../utils/formulas.js";

export class ABTalksService {
  constructor(private store: Store = globalStore) {}

  /**
   * GET /api/student/:id
   */
  public getStudentProfile(studentId: string): StudentProfileResponse {
    let student = this.store.getStudent(studentId);

    if (!student) {
      // If student not found in seed, return empty intentional new student
      student = {
        id: studentId,
        name: "New Developer",
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${studentId}`,
        bio: "",
        track: "Fullstack Web",
        joinedDate: formatDateYYYYMMDD(getSystemDate()),
        currentStreak: 0,
        longestStreak: 0,
        xp: 0,
        level: "Explorer",
        levelNumber: 1,
        totalDaysCompleted: 0,
        lastSubmissionDate: null,
        recruiterVisibilityScore: 0,
        profileComplete: false,
        unlockedThemes: ["default"],
        activeTheme: "default",
        streakFreezeTokens: 1,
        unlockedAchievements: []
      };
      this.store.updateStudent(student);
    }

    const streakState = evaluateStreakState(student.lastSubmissionDate, student.currentStreak);
    const submissions = this.store.getSubmissions(studentId);
    const recruiterScoreBreakdown = calculateRecruiterScore(student, submissions);

    // Calculate leaderboard rank
    const allStudents = this.store.getAllStudents();
    allStudents.sort((a, b) => b.xp - a.xp);
    const rankIndex = allStudents.findIndex((s) => s.id === studentId);
    const rank = rankIndex >= 0 && student.totalDaysCompleted > 0 ? rankIndex + 1 : null;

    // Update recruiter visibility score on student object
    student.recruiterVisibilityScore = recruiterScoreBreakdown.totalScore;
    this.store.updateStudent(student);

    return {
      student,
      missedYesterday: streakState.missedYesterday,
      daysSinceLastSubmission: streakState.daysSinceLastSubmission,
      recruiterScoreBreakdown,
      rank
    };
  }

  /**
   * GET /api/challenges
   */
  public getChallenges(studentId: string = "student-far"): Challenge[] {
    const student = this.store.getStudent(studentId);
    const completedDays = student ? student.totalDaysCompleted : 0;
    const maxUnlockedDay = completedDays + 1;

    const allChallenges = this.store.getChallenges();
    return allChallenges.map((c) => ({
      ...c,
      isLocked: c.day > maxUnlockedDay
    }));
  }

  /**
   * GET /api/challenges/:day
   */
  public getChallengeByDay(day: number, studentId: string = "student-far"): Challenge {
    const challenge = this.store.getChallenge(day);
    if (!challenge) {
      const error: APIError = { code: "NOT_FOUND", message: `Challenge for Day ${day} does not exist.` };
      throw error;
    }

    const student = this.store.getStudent(studentId);
    const completedDays = student ? student.totalDaysCompleted : 0;
    const maxUnlockedDay = completedDays + 1;

    return {
      ...challenge,
      isLocked: day > maxUnlockedDay
    };
  }

  /**
   * POST /api/challenges/:day/submit
   */
  public submitChallenge(day: number, payload: SubmitChallengePayload): SubmitChallengeResult {
    const studentId = payload.studentId || "student-far";
    const studentProfileRes = this.getStudentProfile(studentId);
    let student = studentProfileRes.student;

    // 1. Validate URLs
    const urlValidation = validateSubmissionURLs({
      githubRepoUrl: payload.githubRepoUrl,
      githubCommitUrl: payload.githubCommitUrl,
      linkedinPostUrl: payload.linkedinPostUrl
    });

    if (!urlValidation.valid) {
      const error: APIError = {
        code: "INVALID_URLS",
        message: urlValidation.errorMessage || "Invalid URLs provided."
      };
      throw error;
    }

    // 2. Check if day exists
    const challenge = this.store.getChallenge(day);
    if (!challenge) {
      const error: APIError = { code: "NOT_FOUND", message: `Challenge Day ${day} not found.` };
      throw error;
    }

    // 3. Check if day is locked
    const maxUnlockedDay = student.totalDaysCompleted + 1;
    if (day > maxUnlockedDay) {
      const error: APIError = {
        code: "DAY_LOCKED",
        message: `Day ${day} is locked. You must complete Day ${student.totalDaysCompleted + 1} first.`
      };
      throw error;
    }

    // 4. Check if day is already completed
    const existingSubmissions = this.store.getSubmissions(studentId);
    const alreadySubmitted = existingSubmissions.some((s) => s.day === day);
    if (alreadySubmitted) {
      const error: APIError = {
        code: "ALREADY_SUBMITTED",
        message: `Challenge for Day ${day} has already been submitted today.`
      };
      throw error;
    }

    const systemNow = getSystemDate();
    const todayStr = formatDateYYYYMMDD(systemNow);

    // 5. Calculate streak updates
    const streakUpdate = computeNewStreakOnSubmission(student, systemNow);

    // 6. Calculate XP earned
    const xpCalc = calculateSubmissionXP(streakUpdate.newStreak, systemNow);

    // 7. Create submission record
    const submission: Submission = {
      id: `sub-${student.id}-${day}-${Date.now()}`,
      studentId: student.id,
      day,
      githubRepoUrl: payload.githubRepoUrl,
      githubCommitUrl: payload.githubCommitUrl,
      linkedinPostUrl: payload.linkedinPostUrl,
      submittedAt: systemNow.toISOString(),
      xpEarned: xpCalc.totalXP,
      wasEarlySubmission: xpCalc.wasEarly
    };
    this.store.addSubmission(submission);

    // 8. Update student stats
    const previousLevel = student.level;
    const newTotalXp = student.xp + xpCalc.totalXP;
    const levelInfo = calculateLevel(newTotalXp);

    student.xp = newTotalXp;
    student.level = levelInfo.level;
    student.levelNumber = levelInfo.levelNumber;
    student.currentStreak = streakUpdate.newStreak;
    student.longestStreak = streakUpdate.newLongestStreak;
    student.totalDaysCompleted = Math.max(student.totalDaysCompleted, day);
    student.lastSubmissionDate = todayStr;
    student.streakFreezeTokens = streakUpdate.tokensLeft;

    // 9. Evaluate Achievements
    const catalog = this.store.getAchievementsCatalog();
    const updatedSubmissions = this.store.getSubmissions(student.id);
    const newlyUnlocked = evaluateAchievements(student, catalog, updatedSubmissions);

    for (const ach of newlyUnlocked) {
      student.unlockedAchievements.push({
        achievementId: ach.id,
        unlockedAt: systemNow.toISOString()
      });
    }

    // 10. Select Daily Reward Box
    const rewardsCatalog = this.store.getRewardsCatalog();
    const rewardOutcome = selectDailyReward(rewardsCatalog);

    // Apply reward outcome to student
    if (rewardOutcome.type === "xpBonus") {
      student.xp += rewardOutcome.value as number;
      const bonusLevelInfo = calculateLevel(student.xp);
      student.level = bonusLevelInfo.level;
      student.levelNumber = bonusLevelInfo.levelNumber;
    } else if (rewardOutcome.type === "streakFreeze") {
      student.streakFreezeTokens += rewardOutcome.value as number;
    } else if (rewardOutcome.type === "themeUnlock") {
      const themeName = String(rewardOutcome.value);
      if (!student.unlockedThemes.includes(themeName)) {
        student.unlockedThemes.push(themeName);
      }
    }

    // 11. Recruiter Score & AI Coach
    const recruiterScoreBreakdown = calculateRecruiterScore(student, updatedSubmissions);
    student.recruiterVisibilityScore = recruiterScoreBreakdown.totalScore;
    this.store.updateStudent(student);

    const aiCoachInsight = this.getAICoachInsight(student.id);

    return {
      submission,
      xpEarned: xpCalc.totalXP,
      previousLevel,
      newLevel: student.level,
      levelChanged: previousLevel !== student.level,
      newlyUnlockedAchievements: newlyUnlocked,
      rewardBoxResult: {
        reward: rewardOutcome,
        isDuplicateClaim: false
      },
      aiCoachInsight,
      updatedStudent: student,
      recruiterScoreBreakdown
    };
  }

  /**
   * GET /api/student/:id/heatmap
   */
  public getHeatmap(studentId: string): HeatmapEntry[] {
    const student = this.store.getStudent(studentId);

    // Edge case: Brand-new student returns valid non-null empty array
    if (!student || student.totalDaysCompleted === 0) {
      return [];
    }

    const submissions = this.store.getSubmissions(studentId);
    const heatmapMap = new Map<string, { count: number; day: number | null }>();

    for (const sub of submissions) {
      const dateStr = sub.submittedAt.split("T")[0];
      const existing = heatmapMap.get(dateStr) || { count: 0, day: sub.day };
      heatmapMap.set(dateStr, { count: existing.count + 1, day: sub.day });
    }

    const entries: HeatmapEntry[] = [];
    const today = getSystemDate();

    // Generate 60 days back
    for (let i = 59; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDateYYYYMMDD(d);

      const entry = heatmapMap.get(dateStr);
      const count = entry ? entry.count : 0;
      const activityLevel = count === 0 ? 0 : count === 1 ? 2 : count === 2 ? 3 : 4;

      entries.push({
        date: dateStr,
        activityLevel,
        day: entry ? entry.day : null,
        count
      });
    }

    return entries;
  }

  /**
   * GET /api/student/:id/achievements
   */
  public getAchievements(studentId: string): AchievementWithStatus[] {
    const student = this.store.getStudent(studentId);
    const catalog = this.store.getAchievementsCatalog();

    const unlockedMap = new Map<string, string>();
    if (student) {
      for (const u of student.unlockedAchievements) {
        unlockedMap.set(u.achievementId, u.unlockedAt);
      }
    }

    return catalog.map((a) => {
      const unlockedAt = unlockedMap.get(a.id) || null;
      return {
        ...a,
        isUnlocked: unlockedAt !== null,
        unlockedAt
      };
    });
  }

  /**
   * GET /api/leaderboard?sortBy=xp|streak|completion|achievements
   */
  public getLeaderboard(sortBy: "xp" | "streak" | "completion" | "achievements" = "xp"): LeaderboardEntry[] {
    const students = this.store.getAllStudents();

    const sorted = [...students].sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "streak") return b.currentStreak - a.currentStreak;
      if (sortBy === "completion") return b.totalDaysCompleted - a.totalDaysCompleted;
      if (sortBy === "achievements") return b.unlockedAchievements.length - a.unlockedAchievements.length;
      return b.xp - a.xp;
    });

    return sorted.map((s, idx) => ({
      rank: s.totalDaysCompleted > 0 ? idx + 1 : null,
      studentId: s.id,
      name: s.name,
      avatarUrl: s.avatarUrl,
      track: s.track,
      xp: s.xp,
      level: s.level,
      currentStreak: s.currentStreak,
      totalDaysCompleted: s.totalDaysCompleted,
      achievementsCount: s.unlockedAchievements.length
    }));
  }

  /**
   * GET /api/community/spotlight
   */
  public getCommunitySpotlight(): Student[] {
    const students = this.store.getAllStudents();
    return students
      .filter((s) => s.totalDaysCompleted > 0)
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 5);
  }

  /**
   * GET /api/student/:id/ai-coach
   */
  public getAICoachInsight(studentId: string): AICoachInsight {
    const student = this.store.getStudent(studentId);
    const pools = this.store.getAICoachPools();
    const leaderboard = this.getLeaderboard("xp");

    const totalStudents = Math.max(leaderboard.length, 1);
    const rankIndex = leaderboard.findIndex((entry) => entry.studentId === studentId);
    const rank = rankIndex >= 0 ? rankIndex + 1 : totalStudents;
    const percentile = Math.max(1, Math.floor(((totalStudents - rank + 1) / totalStudents) * 100));

    const streak = student ? student.currentStreak : 0;
    const completedDays = student ? student.totalDaysCompleted : 0;

    // Calculate completion probability model
    const baseProb = Math.min(98, Math.max(15, Math.floor((completedDays / 60) * 100 + streak * 1.5)));

    // Pick dynamic template variations
    const percentileTemplate = pools.percentileTemplates[Math.floor(Math.random() * pools.percentileTemplates.length)] || "";
    const probabilityTemplate = pools.probabilityTemplates[Math.floor(Math.random() * pools.probabilityTemplates.length)] || "";
    const nextCalloutTemplate = pools.nextDayCallouts[Math.floor(Math.random() * pools.nextDayCallouts.length)] || "";
    const productiveTimeCallout = pools.productiveTimeCallouts[Math.floor(Math.random() * pools.productiveTimeCallouts.length)] || "";
    const recommendedActionTemplate = pools.recommendedActions[Math.floor(Math.random() * pools.recommendedActions.length)] || "";

    const nextDayNum = Math.min(completedDays + 1, 60);
    const nextChallenge = this.store.getChallenge(nextDayNum);

    const percentileText = percentileTemplate.replace("{percentile}", String(percentile));
    const probabilityText = probabilityTemplate
      .replace("{streak}", String(streak))
      .replace("{probability}", String(baseProb));

    const nextDayCallout = nextCalloutTemplate
      .replace("{nextDay}", String(nextDayNum))
      .replace("{nextTitle}", nextChallenge ? nextChallenge.title : "Final Capstone")
      .replace("{nextDifficulty}", nextChallenge ? nextChallenge.difficulty : "Expert");

    const recommendedAction = recommendedActionTemplate
      .replace("{nextDay}", String(nextDayNum));

    return {
      percentileText,
      completionProbability: baseProb,
      probabilityText,
      nextDayCallout,
      productiveTimeCallout,
      recommendedAction
    };
  }

  /**
   * POST /api/student/:id/profile
   */
  public updateStudentProfile(studentId: string, payload: UpdateProfilePayload): Student {
    const studentProfileRes = this.getStudentProfile(studentId);
    const student = studentProfileRes.student;

    if (payload.avatarUrl) student.avatarUrl = payload.avatarUrl;
    if (payload.bio !== undefined) student.bio = payload.bio;
    if (payload.track) student.track = payload.track;
    if (payload.activeTheme) {
      student.activeTheme = payload.activeTheme;
      if (!student.unlockedThemes.includes(payload.activeTheme)) {
        student.unlockedThemes.push(payload.activeTheme);
      }
    }

    // Check if profile is complete
    if (student.bio.trim().length > 0 && student.avatarUrl.trim().length > 0 && student.track) {
      student.profileComplete = true;
    }

    this.store.updateStudent(student);
    return student;
  }

  /**
   * POST /api/student/:id/recover-streak
   */
  public recoverStreakWithFreezeToken(studentId: string): Student {
    const studentProfileRes = this.getStudentProfile(studentId);
    const student = studentProfileRes.student;

    if (student.streakFreezeTokens <= 0) {
      const error: APIError = {
        code: "NO_FREEZE_TOKENS",
        message: "You do not have any Streak Freeze tokens remaining."
      };
      throw error;
    }

    if (!studentProfileRes.missedYesterday) {
      const error: APIError = {
        code: "NO_MISSED_DAY",
        message: "You did not miss yesterday, so streak recovery is not required."
      };
      throw error;
    }

    const systemNow = getSystemDate();
    const yesterday = new Date(systemNow);
    yesterday.setDate(yesterday.getDate() - 1);

    student.streakFreezeTokens -= 1;
    student.currentStreak += 1;
    student.longestStreak = Math.max(student.longestStreak, student.currentStreak);
    student.lastSubmissionDate = formatDateYYYYMMDD(yesterday);

    this.store.updateStudent(student);
    return student;
  }
}

export const abtalksService = new ABTalksService();
