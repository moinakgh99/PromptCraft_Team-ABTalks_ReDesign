import { create } from "zustand";
import {
  STUDENTS, FLAGGED_SUBMISSIONS,
  type Student, type FlaggedSubmission, type Track,
} from "@/data/mock";

export type Role = "student" | "recruiter" | "admin";

export type Theme = "Dark" | "Cyber" | "Glass" | "Neon" | "Minimal";

const THEMES: Record<Theme, Record<string, string>> = {
  Dark: {
    "--bg": "#050816", "--card": "#111827", "--card-border": "rgba(255,255,255,0.06)",
    "--primary": "#6366f1", "--primary-light": "#818cf8", "--primary-muted": "rgba(99,102,241,0.15)",
    "--secondary": "#06b6d4", "--secondary-muted": "rgba(6,182,212,0.15)",
    "--text": "#f1f5f9", "--muted": "#64748b", "--subtle": "#1e293b",
    "--input-bg": "#0f172a", "--nav-bg": "rgba(5,8,22,0.85)",
    "--success": "#22c55e", "--warning": "#f59e0b", "--danger": "#ef4444",
  },
  Cyber: {
    "--bg": "#000d1a", "--card": "#001a2e", "--card-border": "rgba(0,255,136,0.1)",
    "--primary": "#00ff88", "--primary-light": "#33ffaa", "--primary-muted": "rgba(0,255,136,0.12)",
    "--secondary": "#00ccff", "--secondary-muted": "rgba(0,204,255,0.12)",
    "--text": "#e0fff0", "--muted": "#4d9e7a", "--subtle": "#002a40",
    "--input-bg": "#001020", "--nav-bg": "rgba(0,13,26,0.9)",
    "--success": "#00ff88", "--warning": "#ffcc00", "--danger": "#ff4466",
  },
  Glass: {
    "--bg": "#0a0a14", "--card": "rgba(255,255,255,0.05)", "--card-border": "rgba(255,255,255,0.08)",
    "--primary": "#a78bfa", "--primary-light": "#c4b5fd", "--primary-muted": "rgba(167,139,250,0.12)",
    "--secondary": "#67e8f9", "--secondary-muted": "rgba(103,232,249,0.1)",
    "--text": "#e2e8f0", "--muted": "#7c8fa6", "--subtle": "rgba(255,255,255,0.04)",
    "--input-bg": "rgba(255,255,255,0.03)", "--nav-bg": "rgba(10,10,20,0.7)",
    "--success": "#4ade80", "--warning": "#fbbf24", "--danger": "#f87171",
  },
  Neon: {
    "--bg": "#050010", "--card": "#0d001a", "--card-border": "rgba(240,0,255,0.15)",
    "--primary": "#f000ff", "--primary-light": "#f472ff", "--primary-muted": "rgba(240,0,255,0.12)",
    "--secondary": "#00fff5", "--secondary-muted": "rgba(0,255,245,0.1)",
    "--text": "#fdf4ff", "--muted": "#9d4eac", "--subtle": "#1a0030",
    "--input-bg": "#0a0018", "--nav-bg": "rgba(5,0,16,0.9)",
    "--success": "#00ff88", "--warning": "#ffcc00", "--danger": "#ff2255",
  },
  Minimal: {
    "--bg": "#f8fafc", "--card": "#ffffff", "--card-border": "rgba(0,0,0,0.07)",
    "--primary": "#3730a3", "--primary-light": "#4f46e5", "--primary-muted": "rgba(55,48,163,0.08)",
    "--secondary": "#0e7490", "--secondary-muted": "rgba(14,116,144,0.08)",
    "--text": "#0f172a", "--muted": "#64748b", "--subtle": "#f1f5f9",
    "--input-bg": "#f8fafc", "--nav-bg": "rgba(248,250,252,0.9)",
    "--success": "#16a34a", "--warning": "#d97706", "--danger": "#dc2626",
  },
};

interface XPConfig {
  consistency: number;
  nightOwl: number;
  perfectSubmission: number;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_ROLE = "abtalks_role";
const LS_STUDENT = "abtalks_student_id";

function loadAuth(): { role: Role | null; currentStudent: Student } {
  try {
    const role = localStorage.getItem(LS_ROLE) as Role | null;
    const sid = localStorage.getItem(LS_STUDENT);
    const student = sid ? (STUDENTS.find((s) => s.id === sid) ?? STUDENTS[0]) : STUDENTS[0];
    return { role, currentStudent: student };
  } catch {
    return { role: null, currentStudent: STUDENTS[0] };
  }
}

const initialAuth = loadAuth();

interface AppStore {
  // Auth
  role: Role | null;
  login: (role: Role, student?: Student) => void;
  logout: () => void;

  // current user
  currentStudent: Student;

  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;

  // Recruiter shortlist
  shortlist: string[];
  toggleShortlist: (id: string) => void;

  // Recruiter filters
  recruiterFilters: { track: Track | "All"; minStreak: number; minVisibility: number; activeThisWeek: boolean };
  setRecruiterFilter: (k: string, v: unknown) => void;

  // Flagged submissions
  flaggedSubmissions: FlaggedSubmission[];
  moderateSubmission: (id: string, action: "approved" | "rejected") => void;

  // XP config (admin tunable)
  xpConfig: XPConfig;
  setXPConfig: (c: Partial<XPConfig>) => void;

  // Day submission state
  submittedDays: Set<number>;
  submitDay: (day: number) => void;

  // Admin nudge sent
  nudgeSent: Set<string>;
  sendNudge: (studentId: string) => void;

  // Compare mode
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useStore = create<AppStore>((set) => ({
  role: initialAuth.role,
  login: (role, student) => {
    const s = student ?? STUDENTS[0];
    try {
      localStorage.setItem(LS_ROLE, role);
      localStorage.setItem(LS_STUDENT, s.id);
    } catch { /* ignore */ }
    set({ role, currentStudent: s });
  },
  logout: () => {
    try {
      localStorage.removeItem(LS_ROLE);
      localStorage.removeItem(LS_STUDENT);
    } catch { /* ignore */ }
    set({ role: null, currentStudent: STUDENTS[0] });
  },

  currentStudent: initialAuth.currentStudent,

  theme: "Dark",
  setTheme: (t) => {
    const vars = THEMES[t];
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute("data-theme", t.toLowerCase());
    // body background
    document.body.style.backgroundColor = vars["--bg"];
    document.body.style.color = vars["--text"];
    set({ theme: t });
  },

  shortlist: [],
  toggleShortlist: (id) =>
    set((s) => ({
      shortlist: s.shortlist.includes(id)
        ? s.shortlist.filter((x) => x !== id)
        : [...s.shortlist, id],
    })),

  recruiterFilters: { track: "All", minStreak: 0, minVisibility: 0, activeThisWeek: false },
  setRecruiterFilter: (k, v) =>
    set((s) => ({ recruiterFilters: { ...s.recruiterFilters, [k]: v } })),

  flaggedSubmissions: FLAGGED_SUBMISSIONS,
  moderateSubmission: (id, action) =>
    set((s) => ({
      flaggedSubmissions: s.flaggedSubmissions.map((f) =>
        f.id === id ? { ...f, status: action } : f
      ),
    })),

  xpConfig: { consistency: 50, nightOwl: 30, perfectSubmission: 20 },
  setXPConfig: (c) => set((s) => ({ xpConfig: { ...s.xpConfig, ...c } })),

  submittedDays: new Set(),
  submitDay: (day) =>
    set((s) => ({ submittedDays: new Set([...s.submittedDays, day]) })),

  nudgeSent: new Set(),
  sendNudge: (id) =>
    set((s) => ({ nudgeSent: new Set([...s.nudgeSent, id]) })),

  compareList: [],
  toggleCompare: (id) =>
    set((s) => ({
      compareList: s.compareList.includes(id)
        ? s.compareList.filter((x) => x !== id)
        : s.compareList.length < 3
        ? [...s.compareList, id]
        : s.compareList,
    })),
  clearCompare: () => set({ compareList: [] }),
}));

export { STUDENTS };
