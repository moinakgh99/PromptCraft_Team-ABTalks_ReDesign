export interface ProofOfWorkPipelineProps {
  currentStep?: number; // 1: Build, 2: GitHub, 3: LinkedIn, 4: Public Proof
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function ProofOfWorkPipeline({
  currentStep = 2,
  githubUrl = "",
  linkedinUrl = "",
}: ProofOfWorkPipelineProps) {
  const steps = [
    {
      step: 1,
      title: "01 Build Daily",
      subtitle: "Daily challenge project",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.143a2 2 0 00-1.144.175l-1.15.576A2 2 0 002 17.682V19a2 2 0 002 2h16a2 2 0 002-2v-1.318a2 2 0 00-.572-1.414l-2-1.84z" />
        </svg>
      ),
    },
    {
      step: 2,
      title: "02 GitHub Commit",
      subtitle: githubUrl ? "Commit verified" : "Repo & commit link",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      step: 3,
      title: "03 LinkedIn Post",
      subtitle: linkedinUrl ? "Post verified" : "Social proof post",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
    },
    {
      step: 4,
      title: "04 Public Proof",
      subtitle: "Verified streak & recruiter visibility",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-indigo-500/20 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
            <span>🛡️ Proof of Work Pipeline</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              100% Public Verification
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Recruiters evaluate verified GitHub commits & LinkedIn posts instead of self-reported claims.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative">
        {steps.map((s, idx) => {
          const isActive = s.step <= currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div
              key={s.step}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                  : isActive
                  ? "bg-slate-800/80 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900/40 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? "bg-indigo-500 text-white"
                      : isActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {s.icon}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/40">
                  Step {s.step}
                </span>
              </div>

              <div>
                <div className="font-semibold text-xs text-slate-200">{s.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{s.subtitle}</div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
