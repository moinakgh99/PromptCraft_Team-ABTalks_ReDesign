export type TrackType = "Fullstack Web" | "AI & Machine Learning" | "Systems & Cloud" | "Mobile & Cross-Platform";

export type LevelName = "Explorer" | "Builder" | "Creator" | "Architect" | "Legend";

export interface StudentAchievementUnlock {
  achievementId: string;
  unlockedAt: string;
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  track: TrackType;
  joinedDate: string; // YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: LevelName;
  levelNumber: number; // 1 to 5
  totalDaysCompleted: number;
  lastSubmissionDate: string | null; // YYYY-MM-DD
  recruiterVisibilityScore: number; // 0-100
  profileComplete: boolean;
  unlockedThemes: string[];
  activeTheme: string;
  streakFreezeTokens: number;
  unlockedAchievements: StudentAchievementUnlock[];
}

export interface Challenge {
  day: number;
  title: string;
  description: string;
  learningObjectives: string[];
  buildChecklist: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  isLocked: boolean; // derived dynamically
  track: TrackType;
}

export interface Submission {
  id: string;
  studentId: string;
  day: number;
  githubRepoUrl: string;
  githubCommitUrl: string;
  linkedinPostUrl: string;
  submittedAt: string; // ISO string
  xpEarned: number;
  wasEarlySubmission: boolean;
}

export type ConditionType =
  | "streak"
  | "completed_days"
  | "xp"
  | "early_submissions"
  | "level"
  | "github_linked"
  | "theme_unlocked";

export interface AchievementCondition {
  type: ConditionType;
  value: number | string | boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: AchievementCondition;
}

export interface AchievementWithStatus extends Achievement {
  isUnlocked: boolean;
  unlockedAt: string | null;
}

export interface RewardOutcome {
  id: string;
  type: "xpBonus" | "badge" | "quote" | "avatar" | "themeUnlock" | "streakFreeze" | "surprise";
  title: string;
  description: string;
  value: number | string;
  weight: number;
}

export interface DailyRewardBoxResult {
  reward: RewardOutcome;
  isDuplicateClaim: boolean;
}

export interface RecruiterScoreBreakdown {
  commitScore: number; // max 35
  linkedinScore: number; // max 20
  completionScore: number; // max 25
  streakScore: number; // max 20
  totalScore: number; // 0-100
}

export interface AICoachInsight {
  percentileText: string;
  completionProbability: number;
  probabilityText: string;
  nextDayCallout: string;
  productiveTimeCallout: string;
  recommendedAction: string;
}

export interface HeatmapEntry {
  date: string; // YYYY-MM-DD
  activityLevel: number; // 0..4
  day: number | null;
  count: number;
}

export interface LeaderboardEntry {
  rank: number | null;
  studentId: string;
  name: string;
  avatarUrl: string;
  track: TrackType;
  xp: number;
  level: LevelName;
  currentStreak: number;
  totalDaysCompleted: number;
  achievementsCount: number;
}

export interface SubmitChallengePayload {
  studentId?: string;
  githubRepoUrl: string;
  githubCommitUrl: string;
  linkedinPostUrl: string;
}

export interface SubmitChallengeResult {
  submission: Submission;
  xpEarned: number;
  previousLevel: LevelName;
  newLevel: LevelName;
  levelChanged: boolean;
  newlyUnlockedAchievements: Achievement[];
  rewardBoxResult: DailyRewardBoxResult;
  aiCoachInsight: AICoachInsight;
  updatedStudent: Student;
  recruiterScoreBreakdown: RecruiterScoreBreakdown;
}

export interface UpdateProfilePayload {
  avatarUrl?: string;
  bio?: string;
  track?: TrackType;
  activeTheme?: string;
}

export interface StudentProfileResponse {
  student: Student;
  missedYesterday: boolean;
  daysSinceLastSubmission: number;
  recruiterScoreBreakdown: RecruiterScoreBreakdown;
  rank: number | null;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: APIError };
