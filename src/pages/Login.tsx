import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore, type Role } from "@/store";
import { STUDENTS } from "@/data/mock";

const ROLES: { id: Role; icon: string; title: string; desc: string; dest: string }[] = [
  { id: "student", icon: "🎓", title: "Student", desc: "Access your dashboard, streak, XP, and daily challenges.", dest: "/dashboard" },
  { id: "recruiter", icon: "🔍", title: "Recruiter", desc: "Discover verified builders. Filter by track, streak, and visibility.", dest: "/recruiter" },
  { id: "admin", icon: "⚙️", title: "Admin", desc: "Manage the platform — challenges, submissions, analytics.", dest: "/admin" },
];

const MOCK_RECRUITERS = ["Neha Kapoor · Google", "Rahul Mehta · Flipkart", "Siddharth Iyer · Zepto", "Ananya Rao · Razorpay"];
const MOCK_ADMINS = ["Aditya Singh · ABTalks Core", "Tanvir Hussain · ABTalks Ops"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(MOCK_RECRUITERS[0]);
  const [selectedAdmin, setSelectedAdmin] = useState(MOCK_ADMINS[0]);

  const handleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === "student") {
      login("student", selectedStudent);
      navigate("/dashboard");
    } else if (selectedRole === "recruiter") {
      login("recruiter");
      navigate("/recruiter");
    } else {
      login("admin");
      navigate("/admin");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background blobs */}
      <div className="absolute pointer-events-none animate-float" style={{ top: "5%", left: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="absolute pointer-events-none animate-float-delay" style={{ bottom: "10%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.11) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative z-10 w-full" style={{ maxWidth: 420 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <span className="text-gradient font-bold text-2xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>ABTalks</span>
          </Link>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", marginTop: 4 }}>
            Choose your role to continue
          </p>
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-3 mb-6">
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className="rounded-2xl p-4 text-left transition-all"
              style={{
                background: selectedRole === r.id ? "rgba(99,102,241,0.12)" : "rgba(17,24,39,0.8)",
                border: `1.5px solid ${selectedRole === r.id ? "var(--primary)" : "rgba(255,255,255,0.07)"}`,
                cursor: "pointer",
                transform: selectedRole === r.id ? "scale(1.01)" : "scale(1)",
                boxShadow: selectedRole === r.id ? "0 0 20px rgba(99,102,241,0.2)" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: selectedRole === r.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)" }}
                >
                  {r.icon}
                </span>
                <div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: selectedRole === r.id ? "#a5b4fc" : "var(--text)", fontSize: "0.95rem" }}>
                    {r.title}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
                    {r.desc}
                  </div>
                </div>
                {selectedRole === r.id && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary)" }}>
                    <span style={{ color: "white", fontSize: "0.65rem" }}>✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Profile selector — shown after role pick */}
        {selectedRole === "student" && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 10 }}>
              Click a profile to continue
            </label>
            <div className="flex flex-col gap-2">
              {STUDENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStudent(s);
                    login("student", s);
                    navigate("/dashboard");
                  }}
                  className="flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:border-indigo-500/60 hover:bg-indigo-500/10"
                  style={{
                    background: selectedStudent.id === s.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selectedStudent.id === s.id ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer",
                  }}
                >
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.88rem" }}>{s.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>{s.college} · {s.track} · 🔥 {s.streak}-day streak</div>
                  </div>
                  <span style={{ color: "var(--primary-light)", fontSize: "0.78rem", fontWeight: 600, flexShrink: 0 }}>
                    Select & Go →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedRole === "recruiter" && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 10 }}>
              Click a profile to continue
            </label>
            <div className="flex flex-col gap-2">
              {MOCK_RECRUITERS.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRecruiter(r);
                    login("recruiter");
                    navigate("/recruiter");
                  }}
                  className="flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:border-cyan-500/60 hover:bg-cyan-500/10"
                  style={{
                    background: selectedRecruiter === r ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selectedRecruiter === r ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer",
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(6,182,212,0.15)", fontSize: "1rem" }}>🔍</div>
                  <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.88rem" }}>{r}</span>
                  <span style={{ color: "var(--secondary)", fontSize: "0.78rem", fontWeight: 600, marginLeft: "auto" }}>
                    Select & Go →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedRole === "admin" && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", display: "block", marginBottom: 10 }}>
              Click a profile to continue
            </label>
            <div className="flex flex-col gap-2">
              {MOCK_ADMINS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setSelectedAdmin(a);
                    login("admin");
                    navigate("/admin");
                  }}
                  className="flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:border-amber-500/60 hover:bg-amber-500/10"
                  style={{
                    background: selectedAdmin === a ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selectedAdmin === a ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer",
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)", fontSize: "1rem" }}>⚙️</div>
                  <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.88rem" }}>{a}</span>
                  <span style={{ color: "#f59e0b", fontSize: "0.78rem", fontWeight: 600, marginLeft: "auto" }}>
                    Select & Go →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full rounded-2xl font-semibold transition-all"
          style={{
            background: selectedRole ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#1e293b",
            padding: "14px",
            color: selectedRole ? "white" : "#475569",
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "1rem",
            border: "none",
            cursor: selectedRole ? "pointer" : "not-allowed",
            boxShadow: selectedRole ? "0 0 24px rgba(99,102,241,0.3)" : "none",
          }}
        >
          {selectedRole ? `Continue as ${ROLES.find((r) => r.id === selectedRole)?.title} →` : "Select a role to continue"}
        </button>

        <p className="text-center mt-5" style={{ color: "#334155", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>
          Mock authentication only · No real data is collected
        </p>
      </div>
    </div>
  );
}
