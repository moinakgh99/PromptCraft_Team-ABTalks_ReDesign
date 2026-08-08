import { BackendStudent, BackendChallenge, LeaderboardEntry } from "./api";
import { Student, ChallengeDay, DayStatus, Track, Level } from "../data/mock";

export function resolveBackendStudentId(id: string): string {
  const map: Record<string, string> = {
    s1: "student-far",
    s2: "student-maya",
    s3: "student-missed",
    s4: "student-dev",
    s5: "student-sarah",
    s6: "student-fresh",
    s7: "student-fresh",
    s8: "student-maya",
  };
  return map[id] || id;
}

export function adaptBackendStudent(bStudent: BackendStudent): Student {
  const completedDays = bStudent.totalDaysCompleted ?? 0;
  const streak = bStudent.currentStreak ?? 0;

  const dayStatuses: DayStatus[] = Array.from({ length: 60 }, (_, i) => {
    const day = i + 1;
    if (day <= completedDays) return "completed";
    if (day === completedDays + 1) return "today";
    return "pending";
  });

  return {
    id: bStudent.id,
    name: bStudent.name || "Student",
    avatar: bStudent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${bStudent.id}`,
    avatarUrl: bStudent.avatarUrl,
    college: "Tech Academy",
    track: (bStudent.track as Track) || "Fullstack Web",
    streak,
    currentStreak: streak,
    longestStreak: bStudent.longestStreak ?? streak,
    xp: bStudent.xp ?? 0,
    level: (bStudent.level as Level) || "Explorer",
    levelNumber: bStudent.levelNumber ?? 1,
    completedDays,
    totalDaysCompleted: completedDays,
    recruiterVisibility: bStudent.recruiterVisibilityScore ?? 0,
    recruiterVisibilityScore: bStudent.recruiterVisibilityScore ?? 0,
    consistencyScore: Math.min(100, Math.round((streak / 30) * 100)),
    lastActive: bStudent.lastSubmissionDate ? bStudent.lastSubmissionDate : "Recently",
    lastSubmissionDate: bStudent.lastSubmissionDate,
    status: streak > 0 ? "on-track" : completedDays > 0 ? "at-risk" : "inactive",
    bio: bStudent.bio || "",
    github: `https://github.com/${bStudent.id}`,
    linkedin: `https://linkedin.com/in/${bStudent.id}`,
    dayStatuses,
    badges: (bStudent.unlockedAchievements || []).map((a) => a.achievementId),
    joinedDate: bStudent.joinedDate || "2026-06-01",
    submissions: [],
    streakFreezeTokens: bStudent.streakFreezeTokens ?? 1,
    unlockedThemes: bStudent.unlockedThemes || ["default"],
    activeTheme: bStudent.activeTheme || "default",
    unlockedAchievements: bStudent.unlockedAchievements || []
  };
}

export function adaptLeaderboardEntry(entry: LeaderboardEntry): Student {
  const completedDays = entry.totalDaysCompleted ?? 0;
  const streak = entry.currentStreak ?? 0;

  return {
    id: entry.studentId,
    name: entry.name,
    avatar: entry.avatarUrl,
    avatarUrl: entry.avatarUrl,
    college: "Tech Academy",
    track: entry.track as Track,
    streak,
    currentStreak: streak,
    longestStreak: streak,
    xp: entry.xp,
    level: entry.level as Level,
    completedDays,
    totalDaysCompleted: completedDays,
    recruiterVisibility: Math.min(100, Math.round((completedDays / 60) * 100)),
    recruiterVisibilityScore: Math.min(100, Math.round((completedDays / 60) * 100)),
    consistencyScore: Math.min(100, Math.round((streak / 30) * 100)),
    lastActive: "Recently",
    status: streak > 0 ? "on-track" : "at-risk",
    bio: "",
    github: `https://github.com/${entry.studentId}`,
    linkedin: `https://linkedin.com/in/${entry.studentId}`,
    dayStatuses: [],
    badges: [],
    joinedDate: "2026-06-01",
    submissions: []
  };
}

export function adaptBackendChallenge(c: BackendChallenge): ChallengeDay {
  return {
    day: c.day,
    title: c.title,
    description: c.description,
    difficulty: c.difficulty === "Expert" ? "Hard" : c.difficulty,
    xpReward: 100 + (c.day % 5) * 20,
    tags: [c.track || "General"],
    resources: c.buildChecklist || []
  };
}
