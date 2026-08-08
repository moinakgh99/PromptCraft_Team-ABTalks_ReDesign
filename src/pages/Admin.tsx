import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { STUDENTS, CHALLENGE_DAYS, DAY_COMPLETION_RATES, TRACK_PERFORMANCE } from "@/data/mock";
import { useStore } from "@/store";

const COLORS = ["var(--primary)", "var(--secondary)", "#22c55e", "#f59e0b", "#ef4444"];

type Tab = "overview" | "students" | "challenges" | "health" | "flagged" | "gamify" | "broadcast";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "students", label: "Students", icon: "👥" },
  { id: "challenges", label: "Challenges", icon: "📋" },
  { id: "health", label: "Content Health", icon: "📈" },
  { id: "flagged", label: "Flagged", icon: "🚩" },
  { id: "gamify", label: "Gamification", icon: "⚡" },
  { id: "broadcast", label: "Broadcast", icon: "📢" },
];

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 animate-slide-up"
      style={{ background: "#22c55e", color: "white", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "0.9rem", boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}
    >
      {msg}
      <button onClick={onClose} style={{ marginLeft: 12, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("streak");
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editedDays, setEditedDays] = useState<Record<number, { title: string; description: string; difficulty: string }>>({});
  const [broadcast, setBroadcast] = useState({ title: "", message: "" });

  const { flaggedSubmissions, moderateSubmission, xpConfig, setXPConfig, nudgeSent, sendNudge } = useStore();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const totalStudents = STUDENTS.length;
  const avgStreak = Math.round(STUDENTS.reduce((a, s) => a + s.streak, 0) / STUDENTS.length);
  const avgCompletion = Math.round(STUDENTS.reduce((a, s) => a + (s.completedDays / 60) * 100, 0) / STUDENTS.length);
  const submissionsToday = STUDENTS.filter((s) => s.status !== "inactive").length;
  const atRisk = STUDENTS.filter((s) => s.status === "at-risk" || (s.streak === 0 && s.completedDays > 0));
  const pendingFlags = flaggedSubmissions.filter((f) => f.status === "pending");

  const sortedStudents = [...STUDENTS].sort((a, b) => {
    if (sortKey === "streak") return b.streak - a.streak;
    if (sortKey === "xp") return b.xp - a.xp;
    if (sortKey === "completedDays") return b.completedDays - a.completedDays;
    return 0;
  });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="mb-6">
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--text)" }}>
            Admin Panel
          </h1>
          <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>ABTalks Operations Dashboard</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 rounded-xl whitespace-nowrap transition-all"
              style={{
                padding: "8px 16px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                background: tab === t.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === t.id ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)"}`,
                color: tab === t.id ? "#a5b4fc" : "var(--muted)",
                cursor: "pointer",
              }}
            >
              {t.icon} {t.label}
              {t.id === "flagged" && pendingFlags.length > 0 && (
                <span className="rounded-full text-xs w-4 h-4 flex items-center justify-center" style={{ background: "#ef4444", color: "white", fontSize: "0.65rem" }}>
                  {pendingFlags.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Active Students", value: totalStudents, color: "var(--primary)", icon: "👥" },
                { label: "Average Streak", value: `${avgStreak} days`, color: "#f59e0b", icon: "🔥" },
                { label: "Avg Completion", value: `${avgCompletion}%`, color: "#22c55e", icon: "✅" },
                { label: "Submissions Today", value: submissionsToday, color: "var(--secondary)", icon: "📤" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-5 card-hover" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{s.icon}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Track Performance Chart */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
                  Completion by Track
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={TRACK_PERFORMANCE}>
                    <XAxis dataKey="track" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--subtle)", border: "none", color: "var(--text)", fontFamily: "Inter" }} />
                    <Bar dataKey="avgCompletion" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
                  Students by Track
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={TRACK_PERFORMANCE} dataKey="students" nameKey="track" cx="50%" cy="50%" outerRadius={70} label={({ track, students }) => `${track}: ${students}`}>
                      {TRACK_PERFORMANCE.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--subtle)", border: "none", color: "var(--text)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* At-Risk Radar */}
            <div className="rounded-2xl p-5 mt-4" style={{ background: "var(--card)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>
                🚨 At-Risk Radar
              </h3>
              {atRisk.length === 0 ? (
                <p style={{ color: "#22c55e", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}>🎉 Everyone&apos;s on track!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {atRisk.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl p-3" style={{ background: "var(--card)" }}>
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div style={{ color: "var(--text)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</div>
                          <div style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>Streak: {s.streak} days · Last active: {s.lastActive}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { sendNudge(s.id); showToast(`Nudge sent to ${s.name}!`); }}
                        disabled={nudgeSent.has(s.id)}
                        className="rounded-lg text-xs font-semibold"
                        style={{
                          padding: "6px 14px",
                          background: nudgeSent.has(s.id) ? "rgba(100,116,139,0.15)" : "rgba(239,68,68,0.15)",
                          border: `1px solid ${nudgeSent.has(s.id) ? "rgba(100,116,139,0.3)" : "rgba(239,68,68,0.3)"}`,
                          color: nudgeSent.has(s.id) ? "var(--muted)" : "#ef4444",
                          fontFamily: "Inter, sans-serif",
                          cursor: nudgeSent.has(s.id) ? "not-allowed" : "pointer",
                        }}
                      >
                        {nudgeSent.has(s.id) ? "✓ Sent" : "Send Nudge"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Students Table ── */}
        {tab === "students" && (
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>All Students</h3>
              <div className="flex gap-2 ml-auto">
                {["streak", "xp", "completedDays"].map((k) => (
                  <button
                    key={k}
                    onClick={() => setSortKey(k)}
                    className="text-xs rounded-lg"
                    style={{ padding: "5px 10px", background: sortKey === k ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${sortKey === k ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`, color: sortKey === k ? "var(--primary-light)" : "var(--muted)", fontFamily: "Inter, sans-serif", cursor: "pointer" }}
                  >
                    {k === "completedDays" ? "Days" : k.charAt(0).toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                    {["Student", "Track", "Streak", "Completion", "Last Active", "Status"].map((h) => (
                      <th key={h} className="text-left p-3" style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Inter, sans-serif", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((s) => {
                    const STATUS_COLOR: Record<string, string> = { "on-track": "#22c55e", "at-risk": "#f59e0b", inactive: "#ef4444" };
                    const pct = Math.round((s.completedDays / 60) * 100);
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full" />
                            <span style={{ color: "var(--text)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "0.88rem" }}>{s.name}</span>
                          </div>
                        </td>
                        <td className="p-3"><span style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}>{s.track}</span></td>
                        <td className="p-3"><span style={{ color: "#f59e0b", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>{s.streak}</span></td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full overflow-hidden" style={{ width: 60, height: 4, background: "var(--subtle)" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: "var(--primary)", borderRadius: "9999px" }} />
                            </div>
                            <span style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>{pct}%</span>
                          </div>
                        </td>
                        <td className="p-3"><span style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif" }}>{s.lastActive}</span></td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLOR[s.status]}15`, color: STATUS_COLOR[s.status] }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Challenge Days ── */}
        {tab === "challenges" && (
          <div className="flex flex-col gap-3">
            {CHALLENGE_DAYS.slice(0, 15).map((d) => {
              const isEditing = editingDay === d.day;
              const overrides = editedDays[d.day];
              const title = overrides?.title ?? d.title;
              const desc = overrides?.description ?? d.description;
              const difficulty = overrides?.difficulty ?? d.difficulty;
              return (
                <div key={d.day} className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(99,102,241,0.15)", color: "var(--primary-light)", fontFamily: "Space Grotesk, sans-serif", flexShrink: 0 }}>{d.day}</span>
                      {isEditing ? (
                        <input
                          value={title}
                          onChange={(e) => setEditedDays((p) => ({ ...p, [d.day]: { ...p[d.day], title: e.target.value, description: desc, difficulty } }))}
                          className="rounded-lg text-sm outline-none"
                          style={{ background: "var(--input-bg)", border: "1px solid rgba(99,102,241,0.4)", padding: "6px 10px", color: "var(--text)", fontFamily: "Inter, sans-serif", width: 260 }}
                        />
                      ) : (
                        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>{title}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <select
                          value={difficulty}
                          onChange={(e) => setEditedDays((p) => ({ ...p, [d.day]: { ...p[d.day], title, description: desc, difficulty: e.target.value } }))}
                          style={{ background: "var(--input-bg)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8, padding: "5px 10px", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.82rem" }}
                        >
                          {["Easy", "Medium", "Hard"].map((v) => <option key={v}>{v}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: difficulty === "Hard" ? "rgba(239,68,68,0.1)" : difficulty === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: difficulty === "Hard" ? "#ef4444" : difficulty === "Medium" ? "#f59e0b" : "#22c55e" }}>{difficulty}</span>
                      )}
                      <button
                        onClick={() => {
                          if (isEditing) showToast(`Day ${d.day} saved!`);
                          setEditingDay(isEditing ? null : d.day);
                        }}
                        style={{ background: "none", border: "none", color: isEditing ? "#22c55e" : "var(--muted)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}
                      >
                        {isEditing ? "Save" : "Edit"}
                      </button>
                    </div>
                  </div>
                  {isEditing && (
                    <textarea
                      value={desc}
                      onChange={(e) => setEditedDays((p) => ({ ...p, [d.day]: { ...p[d.day], title, description: e.target.value, difficulty } }))}
                      rows={2}
                      className="mt-3 w-full rounded-lg text-sm outline-none"
                      style={{ background: "var(--input-bg)", border: "1px solid rgba(99,102,241,0.3)", padding: "8px 12px", color: "var(--text-dim, #94a3b8)", fontFamily: "Inter, sans-serif", resize: "vertical" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Content Health ── */}
        {tab === "health" && (
          <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Completion Rate Per Day</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginBottom: 16 }}>
              Spots where students drop off — use this to improve challenge difficulty balance.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={DAY_COMPLETION_RATES}>
                <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 10 }} label={{ value: "Day", position: "insideBottom", offset: -2, fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--subtle)", border: "none", color: "var(--text)", fontFamily: "Inter" }} formatter={(v: number) => [`${v.toFixed(1)}%`, "Completion Rate"]} />
                <Line type="monotone" dataKey="rate" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Flagged Submissions ── */}
        {tab === "flagged" && (
          <div>
            {pendingFlags.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✅</div>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#22c55e", fontWeight: 600 }}>All caught up!</h3>
                <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem" }}>No flagged submissions in the queue.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {flaggedSubmissions.map((f) => (
                  <div key={f.id} className="rounded-2xl p-5" style={{ background: "var(--card)", border: `1px solid ${f.status === "pending" ? "rgba(239,68,68,0.2)" : f.status === "approved" ? "rgba(34,197,94,0.2)" : "rgba(100,116,139,0.2)"}` }}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)" }}>{f.studentName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>Day {f.day}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: f.status === "pending" ? "rgba(245,158,11,0.1)" : f.status === "approved" ? "rgba(34,197,94,0.1)" : "rgba(100,116,139,0.1)",
                            color: f.status === "pending" ? "#f59e0b" : f.status === "approved" ? "#22c55e" : "var(--muted)",
                          }}>{f.status}</span>
                        </div>
                        <p style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>
                          ⚠️ {f.reason}
                        </p>
                        <div className="flex gap-3">
                          <a href={f.githubLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)", fontSize: "0.78rem" }}>GitHub ↗</a>
                          <a href={f.linkedinLink} target="_blank" rel="noreferrer" style={{ color: "var(--secondary)", fontSize: "0.78rem" }}>LinkedIn ↗</a>
                        </div>
                      </div>
                      {f.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => { moderateSubmission(f.id, "approved"); showToast("Submission approved!"); }}
                            style={{ padding: "8px 16px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, color: "#22c55e", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", cursor: "pointer" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { moderateSubmission(f.id, "rejected"); showToast("Submission rejected."); }}
                            style={{ padding: "8px 16px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", cursor: "pointer" }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Gamification Tuning ── */}
        {tab === "gamify" && (
          <div className="rounded-2xl p-6 max-w-lg" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>XP Bonus Tuning</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginBottom: 20 }}>
              Adjust XP bonuses applied across the platform. Changes take effect immediately.
            </p>
            {[
              { label: "Consistency Bonus", key: "consistency" as const, max: 200 },
              { label: "Night Owl Bonus", key: "nightOwl" as const, max: 100 },
              { label: "Perfect Submission Bonus", key: "perfectSubmission" as const, max: 100 },
            ].map((item) => (
              <div key={item.key} className="mb-6">
                <div className="flex justify-between mb-2">
                  <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>{item.label}</label>
                  <span style={{ color: "var(--primary)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>+{xpConfig[item.key]} XP</span>
                </div>
                <input
                  type="range" min={0} max={item.max}
                  value={xpConfig[item.key]}
                  onChange={(e) => setXPConfig({ [item.key]: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between mt-1">
                  <span style={{ color: "var(--subtle)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>0</span>
                  <span style={{ color: "var(--subtle)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>{item.max}</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => showToast("XP config saved to store!")}
              className="rounded-xl font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: "10px 24px", color: "white", fontFamily: "Space Grotesk, sans-serif", border: "none", cursor: "pointer" }}
            >
              Save Config
            </button>
          </div>
        )}

        {/* ── Broadcast ── */}
        {tab === "broadcast" && (
          <div className="max-w-lg">
            <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Broadcast Announcement</h3>
              <div className="mb-4">
                <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>Title</label>
                <input
                  value={broadcast.title}
                  onChange={(e) => setBroadcast((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Week 2 Kickoff!"
                  className="w-full rounded-xl outline-none"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)", padding: "10px 14px", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}
                />
              </div>
              <div className="mb-5">
                <label style={{ color: "var(--text-dim, #94a3b8)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>Message</label>
                <textarea
                  value={broadcast.message}
                  onChange={(e) => setBroadcast((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Write your announcement here…"
                  rows={4}
                  className="w-full rounded-xl outline-none resize-none"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)", padding: "10px 14px", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}
                />
              </div>
              <button
                disabled={!broadcast.title || !broadcast.message}
                onClick={() => { showToast(`📢 Sent to ${totalStudents} students!`); setBroadcast({ title: "", message: "" }); }}
                className="rounded-xl font-semibold w-full"
                style={{
                  background: broadcast.title && broadcast.message ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#1e293b",
                  padding: "12px",
                  color: broadcast.title && broadcast.message ? "white" : "var(--muted)",
                  fontFamily: "Space Grotesk, sans-serif",
                  border: "none",
                  cursor: broadcast.title && broadcast.message ? "pointer" : "not-allowed",
                }}
              >
                Send to {totalStudents} Students
              </button>
            </div>
          </div>
        )}

      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
