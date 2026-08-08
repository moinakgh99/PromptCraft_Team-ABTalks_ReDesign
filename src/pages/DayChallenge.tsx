import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CHALLENGE_DAYS, RANDOM_LOOT } from "@/data/mock";
import { useStore } from "@/store";

const CONSISTENCY_MESSAGES = [
  "You are ahead of 73% of students in this cohort.",
  "Your consistency score: 91%. Top tier.",
  "Completion probability for this challenge: 88%.",
  "Next challenge difficulty: Medium.",
  "Suggested focus time: 90 minutes of deep work.",
];

export default function DayChallenge() {
  const { day } = useParams<{ day: string }>();
  const dayNum = parseInt(day || "12", 10);
  const challenge = CHALLENGE_DAYS[dayNum - 1] || CHALLENGE_DAYS[11];

  const { submittedDays, submitDay, currentStudent } = useStore();
  const isSubmitted = submittedDays.has(dayNum);

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(isSubmitted);
  const [step, setStep] = useState(0);
  const [loot, setLoot] = useState<ReturnType<typeof RANDOM_LOOT> | null>(null);
  const [aiMsg, setAiMsg] = useState("");
  const [xpEarned] = useState(challenge.xpReward + 50 + 30 + 20);

  const alreadyDone = currentStudent.dayStatuses[dayNum - 1] === "completed";

  useEffect(() => {
    if (submitted) {
      const msgs = CONSISTENCY_MESSAGES;
      let i = 0;
      const interval = setInterval(() => {
        setAiMsg(msgs[i % msgs.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!github || !linkedin) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    submitDay(dayNum);
    setLoot(RANDOM_LOOT());
    setSubmitted(true);
    setSubmitting(false);
  };

  const completedPct = Math.round((currentStudent.completedDays / 60) * 100);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "16px" }}>
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--muted)" }}>
          <Link to="/dashboard" style={{ color: "var(--primary)", textDecoration: "none" }}>Dashboard</Link>
          <span>›</span>
          <span style={{ color: "var(--text-dim, #94a3b8)" }}>Day {dayNum}</span>
        </div>

        {/* Challenge card */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{ background: "var(--card)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "rgba(99,102,241,0.15)", color: "var(--primary-light)" }}
              >
                Day {dayNum} / 60
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: challenge.difficulty === "Hard" ? "rgba(239,68,68,0.1)" : challenge.difficulty === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
                  color: challenge.difficulty === "Hard" ? "#ef4444" : challenge.difficulty === "Medium" ? "#f59e0b" : "#22c55e",
                  border: `1px solid ${challenge.difficulty === "Hard" ? "rgba(239,68,68,0.3)" : challenge.difficulty === "Medium" ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`,
                }}
              >
                {challenge.difficulty}
              </span>
            </div>
            <span style={{ color: "#f59e0b", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>
              ⚡ {challenge.xpReward} XP
            </span>
          </div>

          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
            {challenge.title}
          </h1>

          <p style={{ color: "var(--text-dim, #94a3b8)", lineHeight: 1.7, fontFamily: "Inter, sans-serif", fontSize: "0.95rem" }}>
            {challenge.description}
          </p>

          <div className="flex gap-2 mt-4 flex-wrap">
            {challenge.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary-light)" }}>
                #{t}
              </span>
            ))}
          </div>

          {challenge.resources.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Resources
              </div>
              {challenge.resources.map((r) => (
                <a
                  key={r}
                  href={`https://${r}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm"
                  style={{ color: "var(--primary)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}
                >
                  → {r}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Steps reveal */}
        <div className="rounded-2xl p-6 mb-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
            How to Complete This Challenge
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { n: 1, title: "Understand the Brief", desc: "Read the challenge carefully. Google any concepts you don't know before writing a single line." },
              { n: 2, title: "Build and Commit", desc: "Build your solution and push it to GitHub. Make sure your commit message is descriptive." },
              { n: 3, title: "Post on LinkedIn", desc: "Share what you built, what you learned, and what was hard. Tag #ABTalks60Days." },
              { n: 4, title: "Submit Proof", desc: "Paste both links below. Your streak and XP are updated immediately." },
            ].map((s, i) => (
              <div
                key={s.n}
                className="flex gap-4 cursor-pointer transition-all"
                onClick={() => setStep(i)}
                style={{ opacity: step >= i ? 1 : 0.45 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all"
                  style={{
                    background: step >= i ? "rgba(99,102,241,0.25)" : "#1e293b",
                    border: `2px solid ${step >= i ? "var(--primary)" : "var(--subtle)"}`,
                    color: step >= i ? "var(--primary-light)" : "var(--muted)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>{s.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress fill bar */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="flex justify-between mb-2">
            <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>Overall Progress</span>
            <span style={{ color: "var(--text-dim, #94a3b8)", fontFamily: "Space Grotesk, sans-serif", fontSize: "0.85rem" }}>{completedPct}%</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--subtle)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${completedPct}%`, background: "linear-gradient(90deg, #6366f1, #06b6d4)", transition: "width 1.4s ease" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {[0, 25, 50, 75, 100].map((m) => (
              <span key={m} style={{ color: completedPct >= m ? "var(--primary)" : "var(--subtle)", fontSize: "0.7rem", fontFamily: "Inter, sans-serif" }}>
                {m}%
              </span>
            ))}
          </div>
        </div>

        {/* Submission form or success */}
        {(submitted || alreadyDone) ? (
          <div className="rounded-2xl p-8 text-center animate-fade-in" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(99,102,241,0.08))", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>
              Day {dayNum} Completed!
            </h2>
            <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 16 }}>
              +{xpEarned} XP earned · Streak maintained 🔥
            </p>

            {/* XP Breakdown */}
            <div className="rounded-xl p-4 mb-5 text-left" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>XP Breakdown</div>
              {[
                { label: "Base XP", val: challenge.xpReward },
                { label: "Consistency Bonus", val: 50 },
                { label: "Night Owl Bonus", val: 30 },
                { label: "Perfect Submission", val: 20 },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-1">
                  <span style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>{row.label}</span>
                  <span style={{ color: "#22c55e", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>+{row.val}</span>
                </div>
              ))}
            </div>

            {/* AI Momentum Coach */}
            <div className="rounded-xl p-4 mb-5 text-left" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="text-xs mb-2" style={{ color: "var(--primary-light)", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>🤖 AI Momentum Coach</div>
              <p style={{ color: "#c7d2fe", fontFamily: "Inter, sans-serif", fontSize: "0.88rem", minHeight: 20, transition: "all 0.5s" }}>
                {aiMsg || "Analyzing your momentum…"}
              </p>
            </div>

            {/* Loot reveal */}
            {loot && (
              <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)" }}>
                <div className="text-xs mb-2" style={{ color: "#f59e0b", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>🎁 Daily Loot Unlocked</div>
                <div style={{ fontSize: "1.6rem" }}>
                  {loot.type === "badge" ? "🏅" : loot.type === "quote" ? "💬" : loot.type === "avatar" ? "🎭" : "🎨"}
                </div>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{loot.value}</div>
                <span className="text-xs" style={{ color: loot.rarity === "legendary" ? "#f59e0b" : loot.rarity === "rare" ? "var(--primary-light)" : "var(--muted)" }}>
                  {loot.rarity}
                </span>
              </div>
            )}

            <Link
              to="/dashboard"
              className="inline-block rounded-xl font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", padding: "12px 28px", color: "white", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}
            >
              Back to Dashboard →
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6"
            style={{ background: "var(--card)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
              Submit Proof of Work
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 20 }}>
              Both links are required to count towards your streak.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 6, display: "block" }}>
                  GitHub Commit URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourname/repo/commit/..."
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--input-bg)",
                    border: `1px solid ${github ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
                    padding: "12px 16px",
                    color: "var(--text)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 6, display: "block" }}>
                  LinkedIn Post URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/posts/yourpost..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--input-bg)",
                    border: `1px solid ${linkedin ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.08)"}`,
                    padding: "12px 16px",
                    color: "var(--text)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!github || !linkedin || submitting}
              className="w-full mt-5 rounded-xl font-semibold transition-all"
              style={{
                background: github && linkedin ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#1e293b",
                padding: "14px",
                color: github && linkedin ? "white" : "var(--muted)",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "1rem",
                border: "none",
                cursor: github && linkedin ? "pointer" : "not-allowed",
              }}
            >
              {submitting ? "Submitting…" : "Submit & Earn XP ⚡"}
            </button>

            {/* Floating CTA hint on mobile */}
            <p className="text-center mt-3 text-xs" style={{ color: "var(--subtle)", fontFamily: "Inter, sans-serif" }}>
              Submission earns {challenge.xpReward + 100} XP + streak continuation
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
