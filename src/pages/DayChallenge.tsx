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

  const { submittedDays, submitChallengeDay, currentStudent } = useStore();
  const isSubmitted = submittedDays.has(dayNum);

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(isSubmitted);
  const [step, setStep] = useState(0);
  const [loot, setLoot] = useState<ReturnType<typeof RANDOM_LOOT> | null>(null);
  const [aiMsg, setAiMsg] = useState("");
  const [xpEarned] = useState(challenge.xpReward + 50 + 30 + 20);

  const alreadyDone = currentStudent.dayStatuses ? currentStudent.dayStatuses[dayNum - 1] === "completed" : false;

  const quizQuestion = {
    question: `Day ${dayNum} Concept Check: What is the primary architecture goal of ${challenge.title}?`,
    options: [
      "Modular design with separation of concerns & clean state management",
      "Writing all code in a single 2000-line monolithic file",
      "Bypassing input validation to reduce lines of code",
      "Hardcoding state variables directly inside render loops",
    ],
    correctIdx: 0,
    explanation: "Modular separation of concerns ensures your codebase remains scalable, testable, and maintainable.",
  };

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

  const handleQuickFillDemo = () => {
    setGithub(`https://github.com/alexmercer/abtalks-day-${dayNum}`);
    setLinkedin(`https://linkedin.com/posts/alexmercer_day${dayNum}-challenge-completed`);
    setSelectedOption(0);
    setReflection("Implemented modular component state, optimized re-renders, and verified REST API endpoints.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!github || !linkedin) return;
    setSubmitting(true);
    await submitChallengeDay(dayNum, github, linkedin);
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
          <span style={{ color: "var(--text-dim, #94a3b8)" }}>Day {dayNum} Challenge</span>
        </div>

        {/* Challenge Header Card */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{ background: "var(--card)", border: "1px solid rgba(139,99,155,0.25)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--primary-muted)", color: "var(--primary-light)" }}
              >
                Day {dayNum} / 60
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: challenge.difficulty === "Hard" ? "rgba(239,68,68,0.15)" : challenge.difficulty === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(52,211,153,0.15)",
                  color: challenge.difficulty === "Hard" ? "#f87171" : challenge.difficulty === "Medium" ? "#fbbf24" : "#34d399",
                  border: `1px solid ${challenge.difficulty === "Hard" ? "rgba(239,68,68,0.3)" : challenge.difficulty === "Medium" ? "rgba(245,158,11,0.3)" : "rgba(52,211,153,0.3)"}`,
                }}
              >
                {challenge.difficulty}
              </span>
            </div>
            <span style={{ color: "var(--primary-light)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "1rem" }}>
              ⚡ {challenge.xpReward} XP
            </span>
          </div>

          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
            {challenge.title}
          </h1>

          <p style={{ color: "var(--muted)", lineHeight: 1.7, fontFamily: "Inter, sans-serif", fontSize: "0.95rem" }}>
            {challenge.description}
          </p>

          <div className="flex gap-2 mt-4 flex-wrap">
            {challenge.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-md" style={{ background: "var(--primary-muted)", color: "var(--primary-light)" }}>
                #{t}
              </span>
            ))}
          </div>

          {challenge.resources.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs mb-2 font-semibold" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Build Checklist & Resources
              </div>
              {challenge.resources.map((r) => (
                <div
                  key={r}
                  className="flex items-center gap-2 text-sm py-1"
                  style={{ color: "var(--primary-light)", fontFamily: "Inter, sans-serif" }}
                >
                  <span>✓</span> <span>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Challenge Steps */}
        <div className="rounded-2xl p-6 mb-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
            Workflow Steps
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { n: 1, title: "1. Read Brief & Setup", desc: "Review project checklist and outline your data structures." },
              { n: 2, title: "2. Build & Test Code", desc: "Write clean code, run unit tests, and verify edge cases locally." },
              { n: 3, title: "3. Commit & Share Proof", desc: "Push to GitHub repo and publish a LinkedIn build reflection." },
              { n: 4, title: "4. Answer Questions & Submit", desc: "Complete the concept quiz below and submit proof links." },
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
                    background: step >= i ? "var(--primary-muted)" : "var(--subtle)",
                    border: `2px solid ${step >= i ? "var(--primary)" : "var(--card-border)"}`,
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

        {/* Progress bar */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="flex justify-between mb-2">
            <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>60-Day Progress</span>
            <span style={{ color: "var(--primary-light)", fontFamily: "Space Grotesk, sans-serif", fontSize: "0.85rem" }}>{completedPct}%</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--subtle)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${completedPct}%`, background: "linear-gradient(90deg, #F8B2B2, #AF719D, #8B639B)", transition: "width 1.4s ease" }}
            />
          </div>
        </div>

        {/* Submission form or success */}
        {(submitted || alreadyDone) ? (
          <div className="rounded-2xl p-8 text-center animate-fade-in" style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(139,99,155,0.12))", border: "1px solid rgba(52,211,153,0.4)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#34d399", marginBottom: 8 }}>
              Day {dayNum} Challenge Verified!
            </h2>
            <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 16 }}>
              +{xpEarned} XP earned · Streak maintained 🔥
            </p>

            {/* XP Breakdown */}
            <div className="rounded-xl p-4 mb-5 text-left" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-xs mb-2 font-bold uppercase tracking-wider" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>XP Reward Breakdown</div>
              {[
                { label: "Base Challenge XP", val: challenge.xpReward },
                { label: "Concept Quiz Bonus", val: 50 },
                { label: "Reflection Submission Bonus", val: 30 },
                { label: "Verified Links Bonus", val: 20 },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-1 border-b border-white/5 last:border-none">
                  <span style={{ color: "var(--text)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>{row.label}</span>
                  <span style={{ color: "#34d399", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>+{row.val} XP</span>
                </div>
              ))}
            </div>

            {/* AI Momentum Coach */}
            <div className="rounded-xl p-4 mb-5 text-left" style={{ background: "var(--primary-muted)", border: "1px solid rgba(139,99,155,0.3)" }}>
              <div className="text-xs mb-2 font-bold uppercase tracking-wider" style={{ color: "var(--primary-light)", fontFamily: "Inter, sans-serif" }}>🤖 AI Momentum Coach</div>
              <p style={{ color: "#fcf8fa", fontFamily: "Inter, sans-serif", fontSize: "0.88rem" }}>
                {aiMsg || "Great job completing today's challenge! Your recruiter visibility score has increased."}
              </p>
            </div>

            {/* Loot reveal */}
            {loot && (
              <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <div className="text-xs mb-2 font-bold uppercase tracking-wider" style={{ color: "#fbbf24", fontFamily: "Inter, sans-serif" }}>🎁 Daily Loot Box Unlocked</div>
                <div style={{ fontSize: "1.8rem" }}>
                  {loot.type === "badge" ? "🏅" : loot.type === "quote" ? "💬" : loot.type === "avatar" ? "🎭" : "🎨"}
                </div>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{loot.value}</div>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded mt-1 inline-block" style={{ background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                  {loot.rarity}
                </span>
              </div>
            )}

            <Link
              to="/dashboard"
              className="inline-block rounded-xl font-semibold transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #AF719D, #8B639B)", padding: "12px 28px", color: "white", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}
            >
              Back to Dashboard →
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 space-y-6"
            style={{ background: "var(--card)", border: "1px solid rgba(139,99,155,0.3)" }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div>
                <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)" }}>
                  Submit Challenge & Quiz Answers
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
                  Complete the quick concept check and paste your proof links below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition"
              >
                ⚡ Auto-fill Demo Answers & Links
              </button>
            </div>

            {/* Interactive Concept Quiz */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 block">
                ❓ Concept Check Question
              </label>
              <p className="text-sm text-slate-200 font-medium mb-3">{quizQuestion.question}</p>

              <div className="space-y-2">
                {quizQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition border flex items-center justify-between ${
                      selectedOption === idx
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold"
                        : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedOption === idx && <span className="text-indigo-400 font-bold">✓</span>}
                  </button>
                ))}
              </div>

              {selectedOption !== null && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  💡 <strong>Explanation:</strong> {quizQuestion.explanation}
                </div>
              )}
            </div>

            {/* Reflection text area */}
            <div>
              <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 6, display: "block", fontWeight: 600 }}>
                📝 Technical Reflection (What did you build / learn today?)
              </label>
              <textarea
                rows={3}
                placeholder="Describe your implementation details, challenges faced, or key lessons learned..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--input-bg)",
                  border: `1px solid ${reflection ? "rgba(139,99,155,0.5)" : "rgba(255,255,255,0.08)"}`,
                  padding: "12px 16px",
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>

            {/* Proof links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 6, display: "block", fontWeight: 600 }}>
                  🐙 GitHub Commit URL *
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourname/repo/commit/..."
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--input-bg)",
                    border: `1px solid ${github ? "rgba(139,99,155,0.6)" : "rgba(255,255,255,0.08)"}`,
                    padding: "12px 16px",
                    color: "var(--text)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: 6, display: "block", fontWeight: 600 }}>
                  🔗 LinkedIn Post URL *
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/posts/yourpost..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--input-bg)",
                    border: `1px solid ${linkedin ? "rgba(175,113,157,0.6)" : "rgba(255,255,255,0.08)"}`,
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
              className="w-full rounded-xl font-semibold transition-all shadow-lg hover:scale-[1.01]"
              style={{
                background: github && linkedin ? "linear-gradient(135deg, #AF719D, #8B639B)" : "#1c193c",
                padding: "14px",
                color: github && linkedin ? "white" : "var(--muted)",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "1rem",
                border: "none",
                cursor: github && linkedin ? "pointer" : "not-allowed",
              }}
            >
              {submitting ? "Submitting Challenge & Answers…" : `Submit & Claim +${xpEarned} XP ⚡`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
