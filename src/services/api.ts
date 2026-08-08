export const API_BASE_URL = "http://localhost:3001/api";

export interface BackendStudent {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  track: string;
  joinedDate: string;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: "Explorer" | "Builder" | "Creator" | "Architect" | "Legend";
  levelNumber: number;
  totalDaysCompleted: number;
  lastSubmissionDate: string | null;
  recruiterVisibilityScore: number;
  profileComplete: boolean;
  unlockedThemes: string[];
  activeTheme: string;
  streakFreezeTokens: number;
  unlockedAchievements: Array<{ achievementId: string; unlockedAt: string }>;
}

export interface StudentProfileResponse {
  student: BackendStudent;
  missedYesterday: boolean;
  daysSinceLastSubmission: number;
  recruiterScoreBreakdown: {
    commitScore: number;
    linkedinScore: number;
    completionScore: number;
    streakScore: number;
    totalScore: number;
  };
  rank: number | null;
}

export interface BackendChallenge {
  day: number;
  title: string;
  description: string;
  learningObjectives: string[];
  buildChecklist: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  isLocked: boolean;
  track: string;
}

export interface BackendSubmission {
  id: string;
  studentId: string;
  day: number;
  githubRepoUrl: string;
  githubCommitUrl: string;
  linkedinPostUrl: string;
  submittedAt: string;
  xpEarned: number;
  wasEarlySubmission: boolean;
}

export interface SubmitChallengePayload {
  studentId?: string;
  githubRepoUrl: string;
  githubCommitUrl: string;
  linkedinPostUrl: string;
}

export interface SubmitChallengeResult {
  submission: BackendSubmission;
  xpEarned: number;
  previousLevel: string;
  newLevel: string;
  levelChanged: boolean;
  newlyUnlockedAchievements: any[];
  rewardBoxResult: {
    reward: {
      id: string;
      type: string;
      title: string;
      description: string;
      value: any;
      weight: number;
    };
    isDuplicateClaim: boolean;
  };
  aiCoachInsight: AICoachInsight;
  updatedStudent: BackendStudent;
  recruiterScoreBreakdown: any;
}

export interface LeaderboardEntry {
  rank: number | null;
  studentId: string;
  name: string;
  avatarUrl: string;
  track: string;
  xp: number;
  level: string;
  currentStreak: number;
  totalDaysCompleted: number;
  achievementsCount: number;
}

export interface AICoachInsight {
  percentileText: string;
  completionProbability: number;
  probabilityText: string;
  nextDayCallout: string;
  productiveTimeCallout: string;
  recommendedAction: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const json = await response.json();
  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || `HTTP ${response.status} error`;
    throw new Error(errorMsg);
  }

  return json.data as T;
}

export const api = {
  getHealth: () => request<{ status: string; systemDate: string }>("/health"),

  getStudentProfile: (id: string) =>
    request<StudentProfileResponse>(`/student/${id}`),

  getChallenges: (studentId: string = "student-far") =>
    request<BackendChallenge[]>(`/challenges?studentId=${studentId}`),

  getChallengeByDay: (day: number, studentId: string = "student-far") =>
    request<BackendChallenge>(`/challenges/${day}?studentId=${studentId}`),

  submitChallenge: (day: number, payload: SubmitChallengePayload) =>
    request<SubmitChallengeResult>(`/challenges/${day}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getLeaderboard: (sortBy: "xp" | "streak" | "completion" | "achievements" = "xp") =>
    request<LeaderboardEntry[]>(`/leaderboard?sortBy=${sortBy}`),

  getAICoachInsight: (studentId: string) =>
    request<AICoachInsight>(`/student/${studentId}/ai-coach`),

  recoverStreak: (studentId: string) =>
    request<BackendStudent>(`/student/${studentId}/recover-streak`, {
      method: "POST",
    }),

  updateProfile: (studentId: string, payload: { avatarUrl?: string; bio?: string; track?: string; activeTheme?: string }) =>
    request<BackendStudent>(`/student/${studentId}/profile`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  setSystemDate: (date: string | null) =>
    request<{ message: string; currentDate: string }>("/admin/system-date", {
      method: "POST",
      body: JSON.stringify({ date }),
    }),

  resetAdminStore: () =>
    request<{ message: string }>("/admin/reset", {
      method: "POST",
    }),
};
