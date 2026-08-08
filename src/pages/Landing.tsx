import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TRACKS } from "@/data/mock";
import ProofOfWorkPipeline from "@/components/ProofOfWorkPipeline";

const TRACK_ICONS: Record<string, string> = {
  "Web Dev": "🌐", DSA: "⚔️", "AI/ML": "🤖", Mobile: "📱", DevOps: "⚙️",
};

const TRACK_DESCS: Record<string, string> = {
  "Web Dev": "React, Next.js, full-stack apps, APIs",
  DSA: "Leetcode-style problems, system design",
  "AI/ML": "ML models, NLP, computer vision",
  Mobile: "Flutter, React Native, iOS/Android",
  DevOps: "CI/CD, Docker, Kubernetes, Cloud",
};

const STEPS = [
  { n: "01", title: "Pick Your Track", desc: "Choose from Web Dev, DSA, AI/ML, Mobile, or DevOps. One focused path for 60 days." },
  { n: "02", title: "Build Every Day", desc: "Receive a daily challenge. Build it, push a GitHub commit, and post on LinkedIn — that's your proof of work." },
  { n: "03", title: "Earn Your Edge", desc: "Maintain a streak, unlock XP, climb leaderboards. Recruiters can see verified consistency scores." },
];

const PROOF = [
  { num: "2,400+", label: "Students Enrolled" },
  { num: "68%", label: "Completion Rate" },
  { num: "340+", label: "Recruiters Watching" },
  { num: "60 Days", label: "To Transform Your Profile" },
];

function AnimatedNumber({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const numVal = parseFloat(target.replace(/[^0-9.]/g, ""));
          const suffix2 = target.replace(/[0-9.]/g, "").replace(suffix, "");
          let start = 0;
          const steps = 40;
          const step = numVal / steps;
          let frame = 0;
          const interval = setInterval(() => {
            frame++;
            start = Math.min(start + step, numVal);
            setDisplay(
              (Number.isInteger(numVal) ? Math.round(start) : start.toFixed(0)) + suffix2
            );
            if (frame >= steps) clearInterval(interval);
          }, 30);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix]);

  return <div ref={ref}>{display || target}</div>;
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const [selectedTrack, setSelectedTrack] = useState<string>("Web Dev");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-24" style={{ minHeight: "92vh" }}>
        {/* Floating blobs */}
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            top: "10%", left: "15%", width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none animate-float-delay"
          style={{
            top: "30%", right: "10%", width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            bottom: "5%", left: "40%", width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full text-sm mb-6 animate-fade-in"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            padding: "6px 16px",
            color: "var(--primary-light)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
          Cohort 3 · 2,400+ students enrolled
        </div>

        {/* Headline */}
        <h1
          className="animate-slide-up"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 820,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          60 Days.{" "}
          <span className="text-gradient">Daily Commits.</span>
          <br />
          One Career-Defining Move.
        </h1>

        <p
          className="mt-6 animate-slide-up"
          style={{
            color: "var(--text-dim, #94a3b8)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 560,
            lineHeight: 1.7,
            fontFamily: "Inter, sans-serif",
            animationDelay: "100ms",
          }}
        >
          ABTalks is a structured 60-day coding challenge for Indian college students.
          Build something every day. Prove it. Stand out to recruiters.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Link
            to="/login"
            className="rounded-xl text-white font-semibold transition-all animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              padding: "14px 32px",
              fontSize: "1rem",
              fontFamily: "Space Grotesk, sans-serif",
              textDecoration: "none",
            }}
          >
            Start Your 60-Day Journey →
          </Link>
          <Link
            to="/recruiter"
            className="rounded-xl font-medium transition-all"
            style={{
              border: "1px solid rgba(99,102,241,0.4)",
              padding: "14px 28px",
              fontSize: "1rem",
              color: "#a5b4fc",
              fontFamily: "Space Grotesk, sans-serif",
              textDecoration: "none",
            }}
          >
            I&apos;m a Recruiter
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-indigo-500 to-transparent" />
        </div>
      </section>

      {/* ── Social Proof Strip ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(99,102,241,0.04)" }}>
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {PROOF.map((p) => (
            <ScrollReveal key={p.label}>
              <div
                className="text-gradient font-bold"
                style={{ fontSize: "2rem", fontFamily: "Space Grotesk, sans-serif" }}
              >
                <AnimatedNumber target={p.num} />
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
                {p.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <ScrollReveal>
          <h2 className="text-center mb-2" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "var(--text)" }}>
            How It Works
          </h2>
          <p className="text-center mb-10" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
            Four simple steps. Sixty transformative days. Public proof that recruiters check.
          </p>
        </ScrollReveal>

        <div className="mb-12">
          <ProofOfWorkPipeline currentStep={3} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 100}>
              <div
                className="rounded-2xl p-6 card-hover relative overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "1px solid rgba(99,102,241,0.15)",
                }}
              >
                <div
                  className="text-5xl font-black mb-4 absolute top-4 right-5 opacity-10"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--primary)" }}
                >
                  {s.n}
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                >
                  <span style={{ color: "var(--primary-light)", fontSize: "1.1rem" }}>0{i + 1}</span>
                </div>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
                  {s.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Track Selection Preview ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <ScrollReveal>
          <h2 className="text-center mb-2" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "var(--text)" }}>
            Choose Your Track
          </h2>
          <p className="text-center mb-10" style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
            One focused path. One deep skill. Sixty daily builds.
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className="rounded-xl font-medium transition-all"
              style={{
                padding: "10px 20px",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.9rem",
                background: selectedTrack === t ? "rgba(99,102,241,0.25)" : "rgba(17,24,39,0.8)",
                border: `1px solid ${selectedTrack === t ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.08)"}`,
                color: selectedTrack === t ? "#a5b4fc" : "var(--text-dim, #94a3b8)",
              }}
            >
              {TRACK_ICONS[t]} {t}
            </button>
          ))}
        </div>

        <ScrollReveal>
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--card)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <div style={{ fontSize: "3rem" }}>{TRACK_ICONS[selectedTrack]}</div>
            <h3 className="mt-3 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>
              {selectedTrack}
            </h3>
            <p style={{ color: "var(--text-dim, #94a3b8)", fontFamily: "Inter, sans-serif" }}>
              {TRACK_DESCS[selectedTrack]}
            </p>
            <div className="mt-6 flex justify-center gap-6">
              {["60 Challenges", "Daily GitHub", "LinkedIn Posts"].map((tag) => (
                <span
                  key={tag}
                  className="text-sm rounded-full px-3 py-1"
                  style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary-light)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Future Self Preview ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <ScrollReveal>
          <div
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 animate-float" style={{ background: "radial-gradient(circle, #6366f1, transparent)", transform: "translate(30%, -30%)" }} />
            <div className="relative z-10">
              <div className="text-sm mb-3" style={{ color: "var(--primary)", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                ✨ 60 Days From Now…
              </div>
              <h2 className="mb-6" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "var(--text)" }}>
                Your Profile Tells a Story<br />Recruiters Can't Ignore
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: "✅", text: "60 GitHub commits proving consistent output" },
                  { icon: "✅", text: "60 LinkedIn posts building your personal brand" },
                  { icon: "✅", text: "A portfolio recruiters can actually verify" },
                  { icon: "✅", text: "Interview stories backed by real, shipped work" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5">{item.icon}</span>
                    <span style={{ color: "#cbd5e1", fontFamily: "Inter, sans-serif", fontSize: "0.95rem" }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/login"
                className="inline-block mt-8 rounded-xl font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  padding: "14px 32px",
                  color: "white",
                  textDecoration: "none",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                Start Building That Future →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 16px", textAlign: "center" }}>
        <p style={{ color: "var(--subtle)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
          © 2026 ABTalks · Built for India&apos;s Next-Gen Developers
        </p>
      </footer>
    </div>
  );
}
