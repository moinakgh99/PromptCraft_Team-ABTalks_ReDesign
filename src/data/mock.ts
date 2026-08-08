// ─── Types ────────────────────────────────────────────────────────────────────

export type Track =
  | "Fullstack Web"
  | "AI & Machine Learning"
  | "Systems & Cloud"
  | "Mobile & Cross-Platform"
  | "Web Dev"
  | "DSA"
  | "AI/ML"
  | "Mobile"
  | "DevOps";
export type Level = "Explorer" | "Builder" | "Creator" | "Architect" | "Legend";
export type DayStatus = "completed" | "missed" | "pending" | "today";
export type StudentStatus = "on-track" | "at-risk" | "inactive";

export interface Student {
  id: string;
  name: string;
  avatar: string;
  avatarUrl?: string;
  college: string;
  track: Track;
  streak: number;
  currentStreak?: number;
  longestStreak?: number;
  xp: number;
  level: Level;
  levelNumber?: number;
  completedDays: number;
  totalDaysCompleted?: number;
  recruiterVisibility: number;
  recruiterVisibilityScore?: number;
  consistencyScore: number;
  lastActive: string;
  lastSubmissionDate?: string | null;
  status: StudentStatus;
  bio: string;
  github: string;
  linkedin: string;
  dayStatuses: DayStatus[];
  badges: string[];
  joinedDate: string;
  submissions: Submission[];
  streakFreezeTokens?: number;
  unlockedThemes?: string[];
  activeTheme?: string;
  unlockedAchievements?: Array<{ achievementId: string; unlockedAt: string }>;
}

export interface Submission {
  day: number;
  githubLink: string;
  linkedinLink: string;
  githubRepoUrl?: string;
  githubCommitUrl?: string;
  linkedinPostUrl?: string;
  submittedAt: string;
  xpEarned: number;
  wasEarlySubmission?: boolean;
}

export interface ChallengeDay {
  day: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  tags: string[];
  resources: string[];
}

export interface LootBoxReward {
  type: "badge" | "quote" | "avatar" | "theme";
  value: string;
  rarity: "common" | "rare" | "legendary";
}

export interface FlaggedSubmission {
  id: string;
  studentName: string;
  studentId: string;
  day: number;
  githubLink: string;
  linkedinLink: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  flaggedAt: string;
}

// ─── Challenge Days ───────────────────────────────────────────────────────────

export const CHALLENGE_DAYS: ChallengeDay[] = [
  { day: 1, title: "Hello, World — Setup & Deploy", description: "Set up your development environment, create a GitHub repo, and deploy a simple portfolio page. Your journey of 60 days begins with a single commit.", difficulty: "Easy", xpReward: 100, tags: ["Setup", "Git", "Deploy"], resources: ["github.com/git-guides", "vercel.com/docs"] },
  { day: 2, title: "Responsive Navigation", description: "Build a fully responsive navigation bar with hamburger menu for mobile. Implement smooth open/close transitions.", difficulty: "Easy", xpReward: 100, tags: ["HTML", "CSS", "JS"], resources: ["developer.mozilla.org/css"] },
  { day: 3, title: "Dark Mode Toggle", description: "Implement a dark/light mode toggle using CSS variables and localStorage persistence. Users should see their preference saved across sessions.", difficulty: "Easy", xpReward: 120, tags: ["CSS Variables", "localStorage"], resources: [] },
  { day: 4, title: "API Integration — Weather App", description: "Build a weather app that fetches real-time data from the OpenWeatherMap API. Display temperature, humidity, and a 5-day forecast.", difficulty: "Medium", xpReward: 150, tags: ["API", "Fetch", "Async"], resources: ["openweathermap.org/api"] },
  { day: 5, title: "React State Management", description: "Build a Kanban board with drag-and-drop functionality using React state. Implement add, move, and delete card features.", difficulty: "Medium", xpReward: 150, tags: ["React", "State", "DnD"], resources: [] },
  { day: 6, title: "Authentication Flow", description: "Implement a complete auth flow — signup, login, forgot password — using JWT tokens. No backend required; use localStorage mock.", difficulty: "Medium", xpReward: 180, tags: ["Auth", "JWT", "Forms"], resources: [] },
  { day: 7, title: "Week 1 Recap — Portfolio Section", description: "Add a projects section to your portfolio showcasing what you built in Days 1–6. Write a LinkedIn post about your Week 1 journey.", difficulty: "Easy", xpReward: 200, tags: ["Portfolio", "Reflection"], resources: [] },
  { day: 8, title: "Data Structures — Linked List Visualizer", description: "Build an interactive linked list visualizer showing insert, delete, and traversal animations.", difficulty: "Medium", xpReward: 180, tags: ["DSA", "Animation", "Canvas"], resources: [] },
  { day: 9, title: "React Query + Caching", description: "Integrate React Query into an existing app. Implement stale-while-revalidate caching and optimistic updates.", difficulty: "Hard", xpReward: 220, tags: ["React Query", "Caching"], resources: ["tanstack.com/query"] },
  { day: 10, title: "Full-Stack Mini App", description: "Build a full-stack notes app with Express backend, MongoDB, and React frontend. Deploy both.", difficulty: "Hard", xpReward: 250, tags: ["Node.js", "MongoDB", "Express"], resources: [] },
  { day: 11, title: "TypeScript Migration", description: "Migrate a JavaScript project to TypeScript. Add proper types, interfaces, and generics. No any types allowed.", difficulty: "Medium", xpReward: 180, tags: ["TypeScript", "Types"], resources: ["typescriptlang.org"] },
  { day: 12, title: "Custom React Hook Library", description: "Build a library of 5 custom React hooks: useLocalStorage, useDebounce, useFetch, useIntersectionObserver, and useWindowSize. Document each hook with usage examples and publish as an npm package draft.", difficulty: "Hard", xpReward: 250, tags: ["React Hooks", "Custom Hooks", "npm"], resources: ["react.dev/learn/reusing-logic-with-custom-hooks", "docs.npmjs.com"] },
  { day: 13, title: "CSS Grid Masterclass", description: "Recreate a complex magazine-style layout using only CSS Grid. No flexbox allowed for the main layout.", difficulty: "Medium", xpReward: 160, tags: ["CSS Grid", "Layout"], resources: [] },
  { day: 14, title: "Accessibility Audit", description: "Run an accessibility audit on your portfolio using axe-core. Fix all critical and serious issues. Achieve a 100% Lighthouse accessibility score.", difficulty: "Medium", xpReward: 180, tags: ["A11y", "Lighthouse", "ARIA"], resources: [] },
  { day: 15, title: "25% Milestone — Project Showcase", description: "You have completed 25% of the challenge! Build a showcase page for all your projects so far and present it on LinkedIn.", difficulty: "Easy", xpReward: 300, tags: ["Milestone", "Showcase"], resources: [] },
  ...Array.from({ length: 45 }, (_, i) => ({
    day: i + 16,
    title: `Day ${i + 16} Challenge`,
    description: `Advanced challenge for day ${i + 16}. Push your skills further with complex implementations.`,
    difficulty: (["Easy", "Medium", "Hard"] as const)[i % 3],
    xpReward: 150 + (i % 5) * 30,
    tags: ["Advanced", "Practice"],
    resources: [],
  })),
];

// ─── Students ─────────────────────────────────────────────────────────────────

const generateDayStatuses = (completed: number, missed: number): DayStatus[] => {
  const statuses: DayStatus[] = [];
  for (let i = 0; i < 60; i++) {
    if (i < completed - missed) statuses.push("completed");
    else if (i < completed) statuses.push(i % 7 === 3 ? "missed" : "completed");
    else if (i === completed) statuses.push("today");
    else statuses.push("pending");
  }
  return statuses;
};

const generateSubmissions = (count: number): Submission[] =>
  Array.from({ length: count }, (_, i) => ({
    day: i + 1,
    githubLink: `https://github.com/user/abtalks-day-${i + 1}`,
    linkedinLink: `https://linkedin.com/posts/user_day${i + 1}`,
    submittedAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
    xpEarned: 100 + (i % 5) * 30,
  }));

export const STUDENTS: Student[] = [
  {
    id: "student-far", name: "Alex Mercer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    college: "IIT Delhi", track: "Fullstack Web", streak: 14, currentStreak: 14, xp: 5420, level: "Architect",
    completedDays: 42, totalDaysCompleted: 42, recruiterVisibility: 92, recruiterVisibilityScore: 92, consistencyScore: 94,
    lastActive: "Yesterday", status: "on-track",
    bio: "Fullstack engineer passionate about high-performance web applications, distributed microservices, and slick UI design.",
    github: "https://github.com/alexmercer", linkedin: "https://linkedin.com/in/alexmercer",
    dayStatuses: generateDayStatuses(42, 0), badges: ["🔥 Streak Master", "🏗️ Architect", "🎯 40+ Days"],
    joinedDate: "2026-06-25", submissions: generateSubmissions(42), streakFreezeTokens: 2,
  },
  {
    id: "student-maya", name: "Maya Patel", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Maya",
    college: "BITS Pilani", track: "AI & Machine Learning", streak: 20, currentStreak: 20, xp: 2800, level: "Creator",
    completedDays: 24, totalDaysCompleted: 24, recruiterVisibility: 75, recruiterVisibilityScore: 75, consistencyScore: 88,
    lastActive: "Yesterday", status: "on-track",
    bio: "Data Scientist exploring LLMs, RAG pipelines, and PyTorch models.",
    github: "https://github.com/mayapatel", linkedin: "https://linkedin.com/in/mayapatel",
    dayStatuses: generateDayStatuses(24, 0), badges: ["🧠 AI Pioneer", "📊 Data Wizard"],
    joinedDate: "2026-07-10", submissions: generateSubmissions(24), streakFreezeTokens: 2,
  },
  {
    id: "student-missed", name: "Taylor Vance", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Taylor",
    college: "NIT Trichy", track: "AI & Machine Learning", streak: 8, currentStreak: 8, xp: 1850, level: "Creator",
    completedDays: 16, totalDaysCompleted: 16, recruiterVisibility: 58, recruiterVisibilityScore: 58, consistencyScore: 65,
    lastActive: "2 days ago", status: "at-risk",
    bio: "AI & Systems enthusiast grinding through 60 days of code.",
    github: "https://github.com/taylorvance", linkedin: "https://linkedin.com/in/taylorvance",
    dayStatuses: generateDayStatuses(16, 2), badges: ["⚔️ Code Warrior", "🧊 Freeze Saved"],
    joinedDate: "2026-07-20", submissions: generateSubmissions(16), streakFreezeTokens: 1,
  },
  {
    id: "student-dev", name: "Devon Miller", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Devon",
    college: "VIT Vellore", track: "Mobile & Cross-Platform", streak: 28, currentStreak: 28, xp: 3950, level: "Architect",
    completedDays: 32, totalDaysCompleted: 32, recruiterVisibility: 84, recruiterVisibilityScore: 84, consistencyScore: 96,
    lastActive: "Yesterday", status: "on-track",
    bio: "Mobile developer bringing cross-platform magic with React Native and Flutter.",
    github: "https://github.com/devonmiller", linkedin: "https://linkedin.com/in/devonmiller",
    dayStatuses: generateDayStatuses(32, 0), badges: ["📱 App Maestro", "🔥 Streak Master", "🌟 Top 10%"],
    joinedDate: "2026-07-01", submissions: generateSubmissions(32), streakFreezeTokens: 1,
  },
  {
    id: "student-sarah", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sarah",
    college: "IIIT Hyderabad", track: "Systems & Cloud", streak: 58, currentStreak: 58, xp: 8200, level: "Legend",
    completedDays: 58, totalDaysCompleted: 58, recruiterVisibility: 98, recruiterVisibilityScore: 98, consistencyScore: 99,
    lastActive: "Today", status: "on-track",
    bio: "Cloud architect crafting resilient distributed systems.",
    github: "https://github.com/sarahchen", linkedin: "https://linkedin.com/in/sarahchen",
    dayStatuses: generateDayStatuses(58, 0), badges: ["🏆 Legend Tier", "☁️ Cloud Titan", "🔥 50+ Streak"],
    joinedDate: "2026-06-10", submissions: generateSubmissions(58), streakFreezeTokens: 3,
  },
  {
    id: "student-fresh", name: "Jordan Lee", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan",
    college: "Manipal University", track: "Fullstack Web", streak: 0, currentStreak: 0, xp: 0, level: "Explorer",
    completedDays: 0, totalDaysCompleted: 0, recruiterVisibility: 0, recruiterVisibilityScore: 0, consistencyScore: 0,
    lastActive: "Never", status: "inactive",
    bio: "Brand new developer starting the 60-day challenge journey.",
    github: "https://github.com/jordanlee", linkedin: "https://linkedin.com/in/jordanlee",
    dayStatuses: generateDayStatuses(0, 0), badges: ["🌱 Day 1 Ready"],
    joinedDate: "2026-08-08", submissions: [], streakFreezeTokens: 1,
  },
];

// Current logged-in student (Arjun)
export const CURRENT_STUDENT = STUDENTS[0];

// ─── Loot Box Rewards ─────────────────────────────────────────────────────────

export const LOOT_BOX_REWARDS: LootBoxReward[] = [
  { type: "badge", value: "🔥 Streak Keeper", rarity: "common" },
  { type: "badge", value: "⚡ Night Owl", rarity: "rare" },
  { type: "badge", value: "🎯 Sharpshooter", rarity: "common" },
  { type: "badge", value: "💎 Hidden Gem", rarity: "legendary" },
  { type: "quote", value: "Code is poetry. You are the poet.", rarity: "common" },
  { type: "quote", value: "The best time to start was yesterday. The next best time is now.", rarity: "common" },
  { type: "quote", value: "Every expert was once a beginner.", rarity: "rare" },
  { type: "theme", value: "Cyber", rarity: "rare" },
  { type: "theme", value: "Neon", rarity: "legendary" },
  { type: "avatar", value: "🦊", rarity: "common" },
  { type: "avatar", value: "🐉", rarity: "legendary" },
  { type: "avatar", value: "🦁", rarity: "rare" },
];

// ─── Motivational Cards ───────────────────────────────────────────────────────

export const MOTIVATION_DATA = [
  { stat: "Top 5%", label: "of students finish all 60 days. You could be one of them.", emoji: "🏆" },
  { stat: "3×", label: "more likely to get a referral if you post consistently on LinkedIn.", emoji: "📈" },
  { stat: "Day 12", label: "is where most students quit. You are still here.", emoji: "💪" },
  { stat: "89%", label: "of ABTalks alumni reported their streak as a key interview talking point.", emoji: "🎤" },
  { stat: "47 days left", label: "Each day you ship something, you compound your edge.", emoji: "⚡" },
];

// ─── Flagged Submissions ──────────────────────────────────────────────────────

export const FLAGGED_SUBMISSIONS: FlaggedSubmission[] = [
  {
    id: "f1", studentName: "Rahul Verma", studentId: "s3", day: 7,
    githubLink: "https://github.com/rahulverma/day7", linkedinLink: "https://linkedin.com/posts/day7",
    reason: "GitHub commit timestamp doesn't match submission time", status: "pending",
    flaggedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "f2", studentName: "Amit Kumar", studentId: "s7", day: 5,
    githubLink: "https://github.com/amitkumar/day5", linkedinLink: "https://linkedin.com/posts/day5",
    reason: "LinkedIn post appears copied from another student", status: "pending",
    flaggedAt: "2024-01-14T14:20:00Z",
  },
];

// ─── Track Performance ────────────────────────────────────────────────────────

export const TRACK_PERFORMANCE = [
  { track: "Web Dev", avgCompletion: 72, avgXP: 3200, students: 145 },
  { track: "DSA", avgCompletion: 58, avgXP: 2100, students: 89 },
  { track: "AI/ML", avgCompletion: 65, avgXP: 2800, students: 67 },
  { track: "Mobile", avgCompletion: 70, avgXP: 3000, students: 43 },
  { track: "DevOps", avgCompletion: 55, avgXP: 1900, students: 31 },
];

// ─── Day Completion Rates ─────────────────────────────────────────────────────

export const DAY_COMPLETION_RATES = Array.from({ length: 60 }, (_, i) => ({
  day: i + 1,
  rate: Math.max(20, 95 - i * 1.2 + (Math.sin(i * 0.5) * 8)),
}));

// ─── XP Helpers ──────────────────────────────────────────────────────────────

export const XP_THRESHOLDS: Record<Level, number> = {
  Explorer: 0,
  Builder: 1500,
  Creator: 3500,
  Architect: 7000,
  Legend: 12000,
};

export function getLevel(xp: number): Level {
  if (xp >= 12000) return "Legend";
  if (xp >= 7000) return "Architect";
  if (xp >= 3500) return "Creator";
  if (xp >= 1500) return "Builder";
  return "Explorer";
}

export function getLevelProgress(xp: number): { level: Level; nextLevel: Level | null; progress: number } {
  const level = getLevel(xp);
  const levels: Level[] = ["Explorer", "Builder", "Creator", "Architect", "Legend"];
  const idx = levels.indexOf(level);
  const nextLevel = idx < levels.length - 1 ? levels[idx + 1] : null;
  const currentThreshold = XP_THRESHOLDS[level];
  const nextThreshold = nextLevel ? XP_THRESHOLDS[nextLevel] : xp;
  const progress = nextLevel ? ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100 : 100;
  return { level, nextLevel, progress };
}

export const RANDOM_LOOT = (): LootBoxReward => {
  const rand = Math.random();
  const pool = rand < 0.6 ? LOOT_BOX_REWARDS.filter(r => r.rarity === "common")
    : rand < 0.9 ? LOOT_BOX_REWARDS.filter(r => r.rarity === "rare")
    : LOOT_BOX_REWARDS.filter(r => r.rarity === "legendary");
  return pool[Math.floor(Math.random() * pool.length)];
};

export const TRACKS: Track[] = ["Web Dev", "DSA", "AI/ML", "Mobile", "DevOps"];
