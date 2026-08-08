import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store";
import {
  CHALLENGE_DAYS, MOTIVATION_DATA, RANDOM_LOOT,
  getLevelProgress, type DayStatus,
} from "@/data/mock";

const STATUS_COLORS: Record<DayStatus, string> = {
  completed: "#22c55e",
  missed: "#ef4444",
  today: "var(--primary)",
  pending: "#1e293b",
};

type Theme = "Dark" | "Cyber" | "Glass" | "Neon" | "Minimal";
const THEMES: Theme[] = ["Dark", "Cyber", "Glass", "Neon", "Minimal"];

const JOURNEY_STAGES = [
  { label: "Start", pct: 0, emoji: "🌱" },
  { label: "Builder", pct: 25, emoji: "🔨" },
  { label: "Halfway", pct: 50, emoji: "⚡" },
  { label: "Almost", pct: 83, emoji: "🔥" },
  { label: "Legend", pct: 100, emoji: "🏆" },
];

function CircularProgress({ value, size = 80, stroke = 6, color = "var(--primary)" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ - (circ * animated) / 100}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
    </svg>
  );
}

function CountUp({ target }: { target: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let frame = 0;
    const steps = 30;
    const interval = setInterval(() => {
      frame++;
      setN(Math.round((target / steps) * Math.min(frame, steps)));
      if (frame >= steps) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [target]);
  return <>{n}</>;
}

export default function Dashboard() {
  const { currentStudent, theme, setTheme } = useStore();
  const [loot, setLoot] = useState<ReturnType<typeof RANDOM_LOOT> | null>(null);
  const [showLoot, setShowLoot] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const motivIdx = useRef(Math.floor(Math.random() * MOTIVATION_DATA.length));
  const motiv = MOTIVATION_DATA[motivIdx.current];

  const pct = Math.round((currentStudent.completedDays / 60) * 100);
  const { level, nextLevel, progress } = getLevelProgress(currentStudent.xp);
  const today = CHALLENGE_DAYS[currentStudent.completedDays];
  const usualTime = "9:30 PM";
  const bestTime = "8:00 PM";
  const currentPct = currentStudent.completedDays / 60;
  const journeyStage = JOURNEY_STAGES.findLast((s) => s.pct / 100 <= currentPct + 0.01) || JOURNEY_STAGES[0];

  const handleLootOpen = () => {
    setLoot(RANDOM_LOOT());
    setShowLoot(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "16px" }}>
      <div className="max-w-6xl mx-auto">

        {/* Confetti */}
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  background: ["var(--primary)", "var(--secondary)", "#22c55e", "#f59e0b"][i % 4],
                  animation: `fall ${1.5 + Math.random()}s ease-in ${Math.random() * 0.5}s forwards`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)" }}>
              Hey, {currentStudent.name.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", fontFamily: "Inter, sans-serif" }}>
              Day {currentStudent.completedDays + 1} of 60 · {currentStudent.track} Track
            </p>
          </div>
          {/* Theme switcher */}
          <div className="flex gap-1.5 flex-wrap">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="text-xs rounded-lg transition-all"
                style={{
                  padding: "6px 12px",
                  fontFamily: "Inter, sans-serif",
                  background: theme === t ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${theme === t ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.08)"}`,
                  color: theme === t ? "#a5b4fc" : "var(--muted)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Top stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Current Streak", value: currentStudent.streak, suffix: " days", color: "#f59e0b", icon: "🔥" },
            { label: "Days Complete", value: currentStudent.completedDays, suffix: "/60", color: "#22c55e", icon: "✅" },
            { label: "Total XP", value: currentStudent.xp, suffix: "", color: "var(--primary)", icon: "⚡" },
            { label: "Recruiter Visibility", value: currentStudent.recruiterVisibility, suffix: "%", color: "var(--secondary)", icon: "👁" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 card-hover"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{s.icon}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: s.color }}>
                <CountUp target={s.value} />{s.suffix}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">

          {/* Progress ring */}
          <div className="rounded-2xl p-6 card-hover flex flex-col items-center justify-center" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="relative">
              <CircularProgress value={pct} size={120} stroke={8} color="var(--primary)" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)" }}>{pct}%</span>
                <span style={{ color: "var(--muted)", fontSize: "0.7rem" }}>Complete</span>
              </div>
            </div>
            <p className="mt-4 text-center" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.95rem", color: "var(--text-dim, #94a3b8)" }}>
              {60 - currentStudent.completedDays} days left
            </p>
          </div>

          {/* Today's task */}
          <div className="md:col-span-2 rounded-2xl p-6 card-hover" style={{ background: "var(--card)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--primary)", fontFamily: "Inter, sans-serif" }}>Today's Challenge</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: today.difficulty === "Hard" ? "rgba(239,68,68,0.15)" : today.difficulty === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)",
                  color: today.difficulty === "Hard" ? "#ef4444" : today.difficulty === "Medium" ? "#f59e0b" : "#22c55e",
                }}
              >
                {today.difficulty} · {today.xpReward} XP
              </span>
            </div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
              Day {today.day}: {today.title}
            </h2>
            <p style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.9rem", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
              {today.description.slice(0, 140)}…
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {today.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary-light)" }}>{t}</span>
              ))}
            </div>
            <Link
              to={`/day/${today.day}`}
              className="inline-block mt-4 rounded-xl font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: "10px 24px", color: "white", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}
            >
              Go to Challenge →
            </Link>
          </div>
        </div>

        {/* XP Level bar */}
        <div className="rounded-2xl p-5 mb-4 card-hover" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "1.05rem" }}>
                Level: {level}
              </span>
              {nextLevel && (
                <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginLeft: 8 }}>
                  → {nextLevel}
                </span>
              )}
            </div>
            <span style={{ color: "var(--primary)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>
              {currentStudent.xp} XP
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 8, background: "var(--subtle)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                transition: "width 1.4s ease",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>XP Breakdown: consistency +50 · night-owl +30 · perfect +20</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{Math.round(progress)}% to {nextLevel || "Max"}</span>
          </div>
        </div>

        {/* Heatmap + Smart Reminder */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">

          {/* Build Heatmap */}
          <div className="md:col-span-2 rounded-2xl p-5 card-hover" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
              Build Heatmap
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {currentStudent.dayStatuses.map((status, i) => (
                <div
                  key={i}
                  title={`Day ${i + 1}: ${status}`}
                  className="rounded transition-all"
                  style={{
                    width: 14,
                    height: 14,
                    background: STATUS_COLORS[status],
                    opacity: status === "pending" ? 0.3 : 1,
                    cursor: "pointer",
                    boxShadow: status === "today" ? "0 0 8px rgba(99,102,241,0.8)" : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              {(["completed", "missed", "today", "pending"] as DayStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded" style={{ background: STATUS_COLORS[s], opacity: s === "pending" ? 0.3 : 1 }} />
                  <span style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif", textTransform: "capitalize" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Reminder */}
          <div className="rounded-2xl p-5 card-hover flex flex-col justify-between" style={{ background: "var(--card)", border: "1px solid rgba(6,182,212,0.2)" }}>
            <div>
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--secondary)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ⏰ Smart Reminder
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>Usual time</span>
                <span style={{ color: "var(--text-dim, #94a3b8)", fontFamily: "Space Grotesk, sans-serif", fontSize: "0.9rem" }}>{usualTime}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>Best time tonight</span>
                <span style={{ color: "var(--secondary)", fontFamily: "Space Grotesk, sans-serif", fontSize: "0.9rem", fontWeight: 600 }}>{bestTime}</span>
              </div>
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
              You submit best at 9 PM. Starting a bit earlier tonight will give you buffer to polish.
            </p>
          </div>
        </div>

        {/* Recruiter Visibility + Motivation + Daily Loot */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">

          {/* Recruiter Visibility Meter */}
          <div className="rounded-2xl p-5 card-hover" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "var(--secondary)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              👁 Recruiter Visibility
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2.4rem", fontWeight: 700, color: "var(--secondary)" }}>
                {currentStudent.recruiterVisibility}%
              </span>
            </div>
            <div className="rounded-full overflow-hidden mb-3" style={{ height: 6, background: "var(--subtle)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${currentStudent.recruiterVisibility}%`, background: "linear-gradient(90deg, #06b6d4, #0284c7)", transition: "width 1.2s ease" }}
              />
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}>
              {100 - currentStudent.recruiterVisibility} more days to reach Top Visibility
            </p>
          </div>

          {/* Daily Motivation */}
          <div className="rounded-2xl p-5 card-hover" style={{ background: "var(--card)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#f59e0b", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              💡 Today's Insight
            </div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>
              {motiv.stat}
            </div>
            <p className="mt-2" style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
              {motiv.label}
            </p>
          </div>

          {/* Daily Loot Box */}
          <div className="rounded-2xl p-5 card-hover relative overflow-hidden" style={{ background: "var(--card)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "var(--primary-light)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              🎁 Daily Loot
            </div>
            {showLoot && loot ? (
              <div className="animate-fade-in">
                <div style={{ fontSize: "2rem", marginBottom: 4 }}>
                  {loot.type === "badge" || loot.type === "quote" ? "📜" : loot.type === "avatar" ? "🎭" : "🎨"}
                </div>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                  {loot.value}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: loot.rarity === "legendary" ? "rgba(245,158,11,0.15)" : loot.rarity === "rare" ? "rgba(99,102,241,0.15)" : "rgba(100,116,139,0.15)",
                    color: loot.rarity === "legendary" ? "#f59e0b" : loot.rarity === "rare" ? "var(--primary-light)" : "var(--muted)",
                  }}
                >
                  {loot.rarity}
                </span>
              </div>
            ) : (
              <>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 12 }}>
                  Complete today's challenge to unlock a random reward!
                </p>
                <button
                  onClick={handleLootOpen}
                  className="rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", padding: "8px 16px", color: "var(--primary-light)", fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Open Loot Box ✨
                </button>
              </>
            )}
          </div>
        </div>

        {/* Journey Timeline + Achievements */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Journey Timeline */}
          <div className="rounded-2xl p-6 card-hover" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
              Journey Timeline
            </h3>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-4 bottom-4 w-0.5" style={{ background: "var(--subtle)" }} />
              <div
                className="absolute left-5 top-4 w-0.5 transition-all duration-1000"
                style={{ background: "linear-gradient(to bottom, #6366f1, #06b6d4)", height: `${currentPct * 100}%` }}
              />
              <div className="flex flex-col gap-5">
                {JOURNEY_STAGES.map((stage) => {
                  const reached = pct >= stage.pct;
                  const isCurrent = journeyStage.label === stage.label;
                  return (
                    <div key={stage.label} className="flex items-center gap-4 relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 text-sm"
                        style={{
                          background: reached ? "rgba(99,102,241,0.25)" : "#1e293b",
                          border: `2px solid ${reached ? "var(--primary)" : "var(--subtle)"}`,
                          boxShadow: isCurrent ? "0 0 12px rgba(99,102,241,0.5)" : "none",
                        }}
                      >
                        {stage.emoji}
                      </div>
                      <div>
                        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: reached ? "var(--text)" : "var(--muted)", fontSize: "0.9rem" }}>
                          {stage.label}
                          {isCurrent && <span className="ml-2 text-xs" style={{ color: "var(--primary)" }}>← You are here</span>}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>
                          Day {Math.round(stage.pct * 60 / 100) || 1}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Momentum Coach preview */}
          <div className="rounded-2xl p-6 card-hover relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.06))", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "var(--primary-light)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              🤖 AI Momentum Coach
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginBottom: 12 }}>
              Submit today's challenge to unlock your personalized momentum summary.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Consistency Score", value: `${currentStudent.consistencyScore}%`, color: "#22c55e" },
                { label: "Ahead of students", value: "73%", color: "var(--primary)" },
                { label: "Completion probability", value: "88%", color: "var(--secondary)" },
                { label: "Next day difficulty", value: CHALLENGE_DAYS[currentStudent.completedDays + 1]?.difficulty || "N/A", color: "#f59e0b" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>{row.label}</span>
                  <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: row.color, fontSize: "0.9rem" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs" style={{ color: "#4b5563", fontFamily: "Inter, sans-serif" }}>
              Suggested coding time tonight: 8:00–9:30 PM
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
