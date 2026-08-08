import { useState } from "react";
import { STUDENTS, type Student, type Track, TRACKS } from "@/data/mock";
import { useStore } from "@/store";

const STATUS_COLORS: Record<string, string> = {
  "on-track": "#22c55e",
  "at-risk": "#f59e0b",
  inactive: "#ef4444",
};

const LEVEL_COLORS: Record<string, string> = {
  Explorer: "var(--muted)",
  Builder: "var(--primary)",
  Creator: "var(--secondary)",
  Architect: "#f59e0b",
  Legend: "#ef4444",
};

const AI_PITCHES: Record<string, string> = {
  s1: "Full-stack developer with 12 consecutive days of shipped code. Strong GitHub history, public proof of work.",
  s2: "ML practitioner building NLP models. 8-day streak, consistent LinkedIn presence.",
  s3: "DSA-focused competitive programmer in recovery. Showed strong early momentum.",
  s4: "Top 5% — Flutter developer shipping daily. 15-day streak, verified by 15 GitHub commits and LinkedIn posts.",
  s5: "DevOps candidate automating CI/CD pipelines. Consistent learner, 5-day streak.",
  s6: "Hidden Gem: 45-day streak, near-perfect consistency, but low LinkedIn visibility. High ROI hire.",
  s7: "Early-stage developer building fundamentals. Good foundation, needs continued momentum.",
  s8: "NLP researcher with 20 consecutive builds. Strong AI/ML profile, interview-ready.",
};

interface DrawerProps {
  student: Student;
  onClose: () => void;
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
}

function StudentDrawer({ student, onClose, shortlist, toggleShortlist, compareList, toggleCompare }: DrawerProps) {
  const isShortlisted = shortlist.includes(student.id);
  const inCompare = compareList.includes(student.id);
  const STATUS_COLOR_MAP: Record<string, string> = {
    completed: "#22c55e", missed: "#ef4444", today: "var(--primary)", pending: "#1e293b",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative h-full overflow-y-auto"
        style={{
          width: "min(480px, 100vw)",
          background: "var(--card)",
          borderLeft: "1px solid rgba(99,102,241,0.2)",
          padding: "24px",
          animation: "slideInRight 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "var(--muted)", fontSize: "1.3rem", background: "none", border: "none", cursor: "pointer" }}>✕</button>

        <div className="flex items-center gap-4 mb-6">
          <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full" style={{ border: "2px solid rgba(99,102,241,0.4)" }} />
          <div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)" }}>{student.name}</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>{student.college} · {student.track}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${LEVEL_COLORS[student.level]}20`, color: LEVEL_COLORS[student.level] }}>{student.level}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLORS[student.status]}20`, color: STATUS_COLORS[student.status] }}>{student.status}</span>
            </div>
          </div>
        </div>

        {/* AI Pitch */}
        <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--primary-light)", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>🤖 AI Profile Summary</div>
          <p style={{ color: "#c7d2fe", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>{AI_PITCHES[student.id]}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Streak", value: `${student.streak} days`, color: "#f59e0b" },
            { label: "XP", value: student.xp.toLocaleString(), color: "var(--primary)" },
            { label: "Completion", value: `${Math.round((student.completedDays / 60) * 100)}%`, color: "#22c55e" },
            { label: "Recruiter Visibility", value: `${student.recruiterVisibility}%`, color: "var(--secondary)" },
            { label: "Consistency Score", value: `${student.consistencyScore}%`, color: "var(--primary-light)" },
            { label: "Days Done", value: `${student.completedDays}/60`, color: "var(--text-dim, #94a3b8)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: "var(--card)" }}>
              <div style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>{s.label}</div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: s.color, fontSize: "1.1rem" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="mb-5">
          <div className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>Build Heatmap</div>
          <div className="flex flex-wrap gap-1">
            {student.dayStatuses.map((s, i) => (
              <div key={i} title={`Day ${i + 1}`} className="rounded" style={{ width: 10, height: 10, background: STATUS_COLOR_MAP[s], opacity: s === "pending" ? 0.25 : 1 }} />
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="mb-5">
          <div className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>Achievements</div>
          <div className="flex flex-wrap gap-2">
            {student.badges.map((b) => (
              <span key={b} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="mb-5">
          <div className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>Recent Submissions</div>
          {student.submissions.slice(-3).reverse().map((sub) => (
            <div key={sub.day} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>Day {sub.day}</span>
              <div className="flex gap-3">
                <a href={sub.githubLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>GitHub ↗</a>
                <a href={sub.linkedinLink} target="_blank" rel="noreferrer" style={{ color: "var(--secondary)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>LinkedIn ↗</a>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => toggleShortlist(student.id)}
            className="flex-1 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: isShortlisted ? "rgba(34,197,94,0.2)" : "rgba(99,102,241,0.15)",
              border: `1px solid ${isShortlisted ? "rgba(34,197,94,0.4)" : "rgba(99,102,241,0.3)"}`,
              padding: "10px",
              color: isShortlisted ? "#22c55e" : "var(--primary-light)",
              fontFamily: "Space Grotesk, sans-serif",
              cursor: "pointer",
            }}
          >
            {isShortlisted ? "✅ Shortlisted" : "⭐ Shortlist"}
          </button>
          <button
            onClick={() => toggleCompare(student.id)}
            disabled={!inCompare && compareList.length >= 3}
            className="flex-1 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: inCompare ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${inCompare ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.08)"}`,
              padding: "10px",
              color: inCompare ? "var(--secondary)" : "var(--muted)",
              fontFamily: "Space Grotesk, sans-serif",
              cursor: compareList.length >= 3 && !inCompare ? "not-allowed" : "pointer",
            }}
          >
            {inCompare ? "In Compare" : "Compare"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function ComparePanel({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const students = ids.map((id) => STUDENTS.find((s) => s.id === id)!).filter(Boolean);
  if (students.length < 2) return null;

  const METRICS = [
    { label: "Streak", key: "streak" as keyof Student, suffix: " days" },
    { label: "XP", key: "xp" as keyof Student, suffix: "" },
    { label: "Recruiter Visibility", key: "recruiterVisibility" as keyof Student, suffix: "%" },
    { label: "Consistency", key: "consistencyScore" as keyof Student, suffix: "%" },
    { label: "Days Done", key: "completedDays" as keyof Student, suffix: "/60" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)" }} onClick={onClose}>
      <div
        className="rounded-2xl p-6 overflow-auto"
        style={{ background: "var(--card)", border: "1px solid rgba(99,102,241,0.3)", maxWidth: 700, width: "95vw", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)" }}>Compare Students</h2>
          <button onClick={onClose} style={{ color: "var(--muted)", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `120px repeat(${students.length}, 1fr)` }}>
          <div />
          {students.map((s) => (
            <div key={s.id} className="text-center">
              <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full mx-auto mb-1" />
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{s.name.split(" ")[0]}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>{s.track}</div>
            </div>
          ))}
          {METRICS.map((m) => (
            <>
              <div key={m.label + "-label"} className="flex items-center" style={{ color: "var(--muted)", fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}>{m.label}</div>
              {students.map((s) => {
                const val = s[m.key] as number;
                const best = Math.max(...students.map((st) => st[m.key] as number));
                return (
                  <div key={s.id + m.label} className="text-center rounded-lg py-2" style={{ background: val === best ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)" }}>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: val === best ? "var(--primary-light)" : "var(--text-dim, #94a3b8)", fontSize: "1rem" }}>
                      {val}{m.suffix}
                    </span>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Recruiter() {
  const { recruiterFilters, setRecruiterFilter, shortlist, toggleShortlist, compareList, toggleCompare, clearCompare } = useStore();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = STUDENTS.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.college.toLowerCase().includes(search.toLowerCase())) return false;
    if (recruiterFilters.track !== "All" && s.track !== recruiterFilters.track) return false;
    if (s.streak < recruiterFilters.minStreak) return false;
    if (s.recruiterVisibility < recruiterFilters.minVisibility) return false;
    if (recruiterFilters.activeThisWeek && s.status === "inactive") return false;
    return true;
  });

  const hiddenGems = STUDENTS.filter((s) => s.streak >= 20 && s.recruiterVisibility < 50);
  const proofFeed = STUDENTS.flatMap((s) => s.submissions.slice(-1).map((sub) => ({ ...sub, student: s }))).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 8);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "16px" }}>
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--text)" }}>
            Talent Dashboard
          </h1>
          <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
            Verified, consistent builders — sourced directly from 60 days of proof.
          </p>
        </div>

        {/* Hidden Gems */}
        {hiddenGems.length > 0 && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: "1.1rem" }}>💎</span>
              <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "#f59e0b" }}>Talent Radar — Hidden Gems</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {hiddenGems.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", cursor: "pointer" }}
                >
                  <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-full" />
                  <span style={{ color: "#fcd34d", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>
                    {s.name} · {s.streak}-day streak, only {s.recruiterVisibility}% visibility
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-5 sticky top-16" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Filters</h3>

              <input
                type="text"
                placeholder="Search name or college…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl text-sm outline-none mb-4"
                style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)", padding: "10px 12px", color: "var(--text)", fontFamily: "Inter, sans-serif" }}
              />

              <div className="mb-4">
                <label style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>Track</label>
                <select
                  value={recruiterFilters.track}
                  onChange={(e) => setRecruiterFilter("track", e.target.value)}
                  className="w-full rounded-xl text-sm outline-none"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)", padding: "10px 12px", color: "var(--text)", fontFamily: "Inter, sans-serif" }}
                >
                  <option value="All">All Tracks</option>
                  {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>
                  Min Streak: {recruiterFilters.minStreak} days
                </label>
                <input
                  type="range" min={0} max={60}
                  value={recruiterFilters.minStreak}
                  onChange={(e) => setRecruiterFilter("minStreak", Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>
                  Min Visibility: {recruiterFilters.minVisibility}%
                </label>
                <input
                  type="range" min={0} max={100}
                  value={recruiterFilters.minVisibility}
                  onChange={(e) => setRecruiterFilter("minVisibility", Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recruiterFilters.activeThisWeek}
                  onChange={(e) => setRecruiterFilter("activeThisWeek", e.target.checked)}
                  className="accent-indigo-500"
                />
                <span style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>Active this week</span>
              </label>

              {compareList.length >= 2 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCompare(true)}
                    className="w-full rounded-xl font-semibold text-sm"
                    style={{ background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.4)", padding: "10px", color: "var(--secondary)", fontFamily: "Space Grotesk, sans-serif", cursor: "pointer" }}
                  >
                    Compare {compareList.length} Students
                  </button>
                  <button
                    onClick={clearCompare}
                    className="w-full rounded-xl text-xs mt-2"
                    style={{ background: "transparent", border: "none", color: "var(--muted)", fontFamily: "Inter, sans-serif", cursor: "pointer", padding: "4px" }}
                  >
                    Clear compare
                  </button>
                </div>
              )}

              {shortlist.length > 0 && (
                <div className="mt-4 rounded-xl p-3" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <div style={{ color: "#22c55e", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>
                    ⭐ {shortlist.length} shortlisted
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Student Grid */}
          <div className="lg:col-span-2">
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--text-dim, #94a3b8)", fontWeight: 600 }}>No students match your filters</h3>
                <button
                  onClick={() => { setRecruiterFilter("track", "All"); setRecruiterFilter("minStreak", 0); setRecruiterFilter("minVisibility", 0); setSearch(""); }}
                  style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: 8 }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl p-4 card-hover cursor-pointer"
                    style={{ background: "var(--card)", border: `1px solid ${compareList.includes(s.id) ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.06)"}` }}
                    onClick={() => setSelectedStudent(s)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full flex-shrink-0" style={{ border: "2px solid rgba(99,102,241,0.3)" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>{s.name}</span>
                          {shortlist.includes(s.id) && <span style={{ fontSize: "0.7rem", color: "#22c55e" }}>⭐</span>}
                          {hiddenGems.find((g) => g.id === s.id) && <span className="text-xs px-1.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>💎 Gem</span>}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>{s.college} · {s.track}</div>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span style={{ color: "#f59e0b", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>🔥 {s.streak}-day streak</span>
                          <span style={{ color: "var(--secondary)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>👁 {s.recruiterVisibility}%</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${LEVEL_COLORS[s.level]}20`, color: LEVEL_COLORS[s.level] }}>{s.level}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${STATUS_COLORS[s.status]}15`, color: STATUS_COLORS[s.status] }}>{s.status}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "var(--primary)", fontSize: "1rem" }}>{s.xp.toLocaleString()}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>XP</div>
                        <div style={{ color: "#22c55e", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", marginTop: 2 }}>{s.consistencyScore}% consistent</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Proof-of-Work Feed */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>
                📡 Live Activity Feed
              </h3>
              <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 480 }}>
                {proofFeed.map((item, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <img src={item.student.avatar} alt={item.student.name} className="w-6 h-6 rounded-full" />
                      <span style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>{item.student.name.split(" ")[0]}</span>
                      <span style={{ color: "var(--subtle)", fontSize: "0.72rem" }}>· Day {item.day}</span>
                    </div>
                    <div className="flex gap-3 mt-1">
                      <a href={item.githubLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)", fontSize: "0.72rem" }}>GitHub ↗</a>
                      <a href={item.linkedinLink} target="_blank" rel="noreferrer" style={{ color: "var(--secondary)", fontSize: "0.72rem" }}>LinkedIn ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <StudentDrawer
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          shortlist={shortlist}
          toggleShortlist={toggleShortlist}
          compareList={compareList}
          toggleCompare={toggleCompare}
        />
      )}

      {showCompare && <ComparePanel ids={compareList} onClose={() => setShowCompare(false)} />}
    </div>
  );
}
