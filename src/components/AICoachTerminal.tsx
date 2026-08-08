import { useStore } from "@/store";

export default function AICoachTerminal() {
  const { aiCoachInsight, currentStudent } = useStore();

  const probability = aiCoachInsight?.completionProbability ?? Math.min(95, Math.max(20, (currentStudent.streak * 3) + 30));
  const percentile = aiCoachInsight?.percentileText ?? "Top 15% of your cohort";
  const probabilityMsg = aiCoachInsight?.probabilityText ?? `With a ${currentStudent.streak}-day streak, your 60-day completion rate is ${probability}%.`;
  const nextCallout = aiCoachInsight?.nextDayCallout ?? `Day ${Math.min(currentStudent.completedDays + 1, 60)}: Ready for next challenge`;
  const recommendedAction = aiCoachInsight?.recommendedAction ?? "Submit your commit early (before 8:00 PM) for +50 XP Early Bonus.";

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-indigo-500/30 p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
            🤖
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">AI Coach Insights</h3>
            <p className="text-[11px] text-slate-400">Dynamic personalized performance analytics</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {percentile}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Completion Probability</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-display">{probability}%</span>
            <span className="text-[11px] text-slate-400">likelihood to finish 60 days</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${probability}%` }}
            ></div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Upcoming Milestone</div>
          <div className="text-xs text-slate-200 font-medium my-1">{nextCallout}</div>
          <div className="text-[11px] text-indigo-400 flex items-center gap-1 font-mono">
            <span>⚡ Keep momentum</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recommended Action</div>
          <div className="text-xs text-slate-300 my-1 leading-snug">{recommendedAction}</div>
          <div className="text-[11px] text-amber-400 font-mono">+50 XP Early Bonus Available</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 font-mono flex items-center gap-2">
        <span className="text-indigo-400 font-bold">💡 AI Advice:</span>
        <span className="truncate">{probabilityMsg}</span>
      </div>
    </div>
  );
}
