import {
  Student,
  LevelName,
  RecruiterScoreBreakdown,
  Achievement,
  RewardOutcome,
  Submission,
  StudentAchievementUnlock
} from "../types/index.js";

/**
 * Global system date override for testing and deterministic simulation.
 */
let systemDateOverride: string | null = null;

export function setSystemDateOverride(dateStr: string | null): void {
  systemDateOverride = dateStr;
}

export function getSystemDate(): Date {
  if (systemDateOverride) {
    return new Date(systemDateOverride);
  }
  return new Date();
}

export function formatDateYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * ==========================================
 * 1. XP FORMULA
 * ==========================================
 * Total XP = Base XP + Streak Bonus + Early Submission Bonus
 * - Base XP: 100 XP fixed for completing any daily challenge.
 * - Streak Bonus: 15 XP per current streak day, capped at 150 XP max (streak length 10+).
 * - Early Submission Bonus: 50 XP if submitted before 8:00 PM (20:00 local time).
 */
export function calculateSubmissionXP(
  currentStreak: number,
  submittedAtDate: Date = getSystemDate()
): { totalXP: number; baseXP: number; streakBonus: number; earlyBonus: number; wasEarly: boolean } {
  const baseXP = 100;
  // Streak bonus scales by 15 per streak day, capped at 150 XP
  const streakBonus = Math.min(Math.max(currentStreak, 0) * 15, 150);
  
  // Early submission cutoff: hour < 20 (before 8:00 PM)
  const hour = submittedAtDate.getHours();
  const wasEarly = hour < 20;
  const earlyBonus = wasEarly ? 50 : 0;

  const totalXP = baseXP + streakBonus + earlyBonus;

  return {
    totalXP,
    baseXP,
    streakBonus,
    earlyBonus,
    wasEarly
  };
}

/**
 * ==========================================
 * 2. LEVEL THRESHOLDS & MAPPING
 * ==========================================
 * Explicit XP Thresholds:
 * - Level 1: Explorer  (0 - 499 XP)
 * - Level 2: Builder   (500 - 1,499 XP)
 * - Level 3: Creator   (1,500 - 3,499 XP)
 * - Level 4: Architect (3,500 - 6,999 XP)
 * - Level 5: Legend    (7,000+ XP)
 */
export interface LevelDetail {
  level: LevelName;
  levelNumber: number;
  minXp: number;
  maxXp: number | null;
  currentLevelXp: number;
  nextLevelXp: number | null;
  progressPercent: number;
}

export function calculateLevel(xp: number): LevelDetail {
  const safeXp = Math.max(0, xp);

  if (safeXp < 500) {
    const progressPercent = Math.min(100, Math.floor((safeXp / 500) * 100));
    return {
      level: "Explorer",
      levelNumber: 1,
      minXp: 0,
      maxXp: 499,
      currentLevelXp: safeXp,
      nextLevelXp: 500,
      progressPercent
    };
  } else if (safeXp < 1500) {
    const levelXp = safeXp - 500;
    const progressPercent = Math.min(100, Math.floor((levelXp / 1000) * 100));
    return {
      level: "Builder",
      levelNumber: 2,
      minXp: 500,
      maxXp: 1499,
      currentLevelXp: levelXp,
      nextLevelXp: 1500,
      progressPercent
    };
  } else if (safeXp < 3500) {
    const levelXp = safeXp - 1500;
    const progressPercent = Math.min(100, Math.floor((levelXp / 2000) * 100));
    return {
      level: "Creator",
      levelNumber: 3,
      minXp: 1500,
      maxXp: 3499,
      currentLevelXp: levelXp,
      nextLevelXp: 3500,
      progressPercent
    };
  } else if (safeXp < 7000) {
    const levelXp = safeXp - 3500;
    const progressPercent = Math.min(100, Math.floor((levelXp / 3500) * 100));
    return {
      level: "Architect",
      levelNumber: 4,
      minXp: 3500,
      maxXp: 6999,
      currentLevelXp: levelXp,
      nextLevelXp: 7000,
      progressPercent
    };
  } else {
    return {
      level: "Legend",
      levelNumber: 5,
      minXp: 7000,
      maxXp: null,
      currentLevelXp: safeXp - 7000,
      nextLevelXp: null,
      progressPercent: 100
    };
  }
}

/**
 * ==========================================
 * 3. MISSED-DAY & STREAK EVALUATION LOGIC
 * ==========================================
 * Compares lastSubmissionDate to injectable system currentDate.
 */
export function evaluateStreakState(
  lastSubmissionDateStr: string | null,
  currentStreak: number,
  currentDate: Date = getSystemDate()
): {
  daysSinceLastSubmission: number;
  missedYesterday: boolean;
  effectiveStreak: number;
} {
  if (!lastSubmissionDateStr) {
    return {
      daysSinceLastSubmission: -1,
      missedYesterday: false,
      effectiveStreak: 0
    };
  }

  const todayStr = formatDateYYYYMMDD(currentDate);
  const lastDate = new Date(lastSubmissionDateStr);
  const todayDate = new Date(todayStr);

  const diffMs = todayDate.getTime() - lastDate.getTime();
  const daysDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysDiff <= 0) {
    // Submitted today (or in future date)
    return {
      daysSinceLastSubmission: 0,
      missedYesterday: false,
      effectiveStreak: currentStreak
    };
  } else if (daysDiff === 1) {
    // Submitted yesterday, streak is currently active
    return {
      daysSinceLastSubmission: 1,
      missedYesterday: false,
      effectiveStreak: currentStreak
    };
  } else if (daysDiff === 2) {
    // Missed yesterday! (last submission was day before yesterday)
    return {
      daysSinceLastSubmission: 2,
      missedYesterday: true,
      effectiveStreak: currentStreak // might reset on next submission if no token
    };
  } else {
    // Missed multiple days
    return {
      daysSinceLastSubmission: daysDiff,
      missedYesterday: true,
      effectiveStreak: 0
    };
  }
}

/**
 * Updates student streak upon a new valid submission.
 */
export function computeNewStreakOnSubmission(
  student: Student,
  submittedDate: Date = getSystemDate()
): { newStreak: number; newLongestStreak: number; streakFreezeUsed: boolean; tokensLeft: number } {
  const streakState = evaluateStreakState(student.lastSubmissionDate, student.currentStreak, submittedDate);
  let newStreak = 1;
  let streakFreezeUsed = false;
  let tokensLeft = student.streakFreezeTokens;

  if (streakState.daysSinceLastSubmission === 0) {
    // Already submitted today (handled upstream, but return current)
    newStreak = student.currentStreak;
  } else if (streakState.daysSinceLastSubmission === 1 || student.lastSubmissionDate === null) {
    // Consecutive day submission or first submission ever
    newStreak = student.lastSubmissionDate === null ? 1 : student.currentStreak + 1;
  } else if (streakState.daysSinceLastSubmission > 1) {
    // Missed 1 or more days! Check for streak freeze token
    if (student.streakFreezeTokens > 0) {
      streakFreezeUsed = true;
      tokensLeft = student.streakFreezeTokens - 1;
      newStreak = student.currentStreak + 1; // Freeze saved streak!
    } else {
      newStreak = 1; // Streak reset to 1
    }
  }

  const newLongestStreak = Math.max(student.longestStreak, newStreak);

  return {
    newStreak,
    newLongestStreak,
    streakFreezeUsed,
    tokensLeft
  };
}

/**
 * ==========================================
 * 4. RECRUITER VISIBILITY SCORE FORMULA
 * ==========================================
 * Documented Weighted Formula (0 - 100):
 * - GitHub Commit Submissions Count (35% weight): min(submissionsCount / 60, 1) * 35
 * - LinkedIn Posts Count (20% weight): min(linkedinCount / 60, 1) * 20
 * - Challenge Completion % (25% weight): (totalDaysCompleted / 60) * 25
 * - Consistency / Streak Score (20% weight): min(currentStreak / 30, 1) * 20
 */
export function calculateRecruiterScore(
  student: Student,
  submissions: Submission[]
): RecruiterScoreBreakdown {
  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);

  const githubCount = studentSubmissions.filter((s) => s.githubCommitUrl && s.githubCommitUrl.trim().length > 0).length;
  const linkedinCount = studentSubmissions.filter((s) => s.linkedinPostUrl && s.linkedinPostUrl.trim().length > 0).length;

  const commitScore = Math.round(Math.min(githubCount / 60, 1) * 35);
  const linkedinScore = Math.round(Math.min(linkedinCount / 60, 1) * 20);
  const completionScore = Math.round((Math.min(student.totalDaysCompleted, 60) / 60) * 25);
  const streakScore = Math.round(Math.min(student.currentStreak / 30, 1) * 20);

  const totalScore = Math.min(100, commitScore + linkedinScore + completionScore + streakScore);

  return {
    commitScore,
    linkedinScore,
    completionScore,
    streakScore,
    totalScore
  };
}

/**
 * ==========================================
 * 5. ACHIEVEMENT UNLOCK EVALUATION
 * ==========================================
 */
export function evaluateAchievements(
  student: Student,
  catalog: Achievement[],
  submissions: Submission[]
): Achievement[] {
  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);
  const unlockedIds = new Set(student.unlockedAchievements.map((u) => u.achievementId));

  const newlyUnlocked: Achievement[] = [];

  for (const item of catalog) {
    if (unlockedIds.has(item.id)) continue;

    const { type, value } = item.unlockCondition;
    let satisfied = false;

    switch (type) {
      case "streak":
        satisfied = student.currentStreak >= (value as number);
        break;
      case "completed_days":
        satisfied = student.totalDaysCompleted >= (value as number);
        break;
      case "xp":
        satisfied = student.xp >= (value as number);
        break;
      case "early_submissions": {
        const earlyCount = studentSubmissions.filter((s) => s.wasEarlySubmission).length;
        satisfied = earlyCount >= (value as number);
        break;
      }
      case "level": {
        const targetLevel = value as LevelName;
        const levelOrder: LevelName[] = ["Explorer", "Builder", "Creator", "Architect", "Legend"];
        satisfied = levelOrder.indexOf(student.level) >= levelOrder.indexOf(targetLevel);
        break;
      }
      case "github_linked": {
        const hasGithub = studentSubmissions.some((s) => s.githubRepoUrl && s.githubRepoUrl.length > 0);
        satisfied = hasGithub;
        break;
      }
      case "theme_unlocked": {
        satisfied = student.unlockedThemes.length >= (value as number);
        break;
      }
    }

    if (satisfied) {
      newlyUnlocked.push(item);
    }
  }

  return newlyUnlocked;
}

/**
 * ==========================================
 * 6. DAILY REWARD BOX WEIGHTED SELECTION
 * ==========================================
 */
export function selectDailyReward(catalog: RewardOutcome[]): RewardOutcome {
  if (catalog.length === 0) {
    return {
      id: "reward-default",
      type: "xpBonus",
      title: "Bonus +50 XP",
      description: "Standard daily completion reward",
      value: 50,
      weight: 100
    };
  }

  const totalWeight = catalog.reduce((acc, r) => acc + r.weight, 0);
  let random = Math.random() * totalWeight;

  for (const reward of catalog) {
    if (random < reward.weight) {
      return reward;
    }
    random -= reward.weight;
  }

  return catalog[0];
}

/**
 * ==========================================
 * 7. URL VALIDATION HELPER
 * ==========================================
 */
export function validateSubmissionURLs(urls: {
  githubRepoUrl: string;
  githubCommitUrl: string;
  linkedinPostUrl: string;
}): { valid: boolean; errorMessage?: string } {
  const { githubRepoUrl, githubCommitUrl, linkedinPostUrl } = urls;

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

  if (!urlRegex.test(githubRepoUrl) || !githubRepoUrl.toLowerCase().includes("github.com")) {
    return { valid: false, errorMessage: "githubRepoUrl must be a valid GitHub URL (e.g. https://github.com/user/repo)" };
  }

  if (!urlRegex.test(githubCommitUrl) || !githubCommitUrl.toLowerCase().includes("github.com")) {
    return { valid: false, errorMessage: "githubCommitUrl must be a valid GitHub commit URL (e.g. https://github.com/user/repo/commit/abc)" };
  }

  if (!urlRegex.test(linkedinPostUrl) || !linkedinPostUrl.toLowerCase().includes("linkedin.com")) {
    return { valid: false, errorMessage: "linkedinPostUrl must be a valid LinkedIn post URL (e.g. https://linkedin.com/posts/activity-123)" };
  }

  return { valid: true };
}
