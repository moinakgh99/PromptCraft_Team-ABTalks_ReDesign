import { useStore } from "@/store";
import { Student } from "@/data/mock";

export default function CandidateCompareModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { compareList, studentsList, clearCompare } = useStore();

  const selectedStudents = compareList
    .map((id) => studentsList.find((s) => s.id === id))
    .filter(Boolean) as Student[];

  if (selectedStudents.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
              ⚖️ Candidate Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Comparing {selectedStudents.length} candidates across verified proof of work & recruiter scores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
            >
              Clear Selection
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedStudents.map((student) => {
            const commitScore = Math.round(Math.min((student.completedDays || 0) / 60, 1) * 35);
            const linkedinScore = Math.round(Math.min((student.completedDays || 0) / 60, 1) * 20);
            const completionScore = Math.round((Math.min(student.completedDays || 0, 60) / 60) * 25);
            const streakScore = Math.round(Math.min((student.streak || 0) / 30, 1) * 20);
            const totalScore = commitScore + linkedinScore + completionScore + streakScore;

            return (
              <div
                key={student.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{student.name}</h3>
                      <div className="text-xs text-indigo-400 font-mono">{student.track}</div>
                      <div className="text-[11px] text-slate-400">{student.college}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 mb-4 flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Recruiter Visibility</span>
                    <span className="text-sm font-bold text-indigo-400 font-mono">{totalScore}/100</span>
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between text-slate-300">
                      <span>XP Score</span>
                      <span className="font-bold text-amber-400">⚡ {student.xp}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Current Streak</span>
                      <span className="font-bold text-amber-500">🔥 {student.streak} days</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Level</span>
                      <span className="font-semibold text-indigo-300">{student.level}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Days Completed</span>
                      <span className="font-semibold text-slate-200">{student.completedDays}/60</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Weighted Visibility Breakdown
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>GitHub Commits (35%)</span>
                          <span>{commitScore}/35</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(commitScore / 35) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>LinkedIn Posts (20%)</span>
                          <span>{linkedinScore}/20</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(linkedinScore / 20) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Completion % (25%)</span>
                          <span>{completionScore}/25</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(completionScore / 25) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Consistency (20%)</span>
                          <span>{streakScore}/20</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(streakScore / 20) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={student.github || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block w-full text-center py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
                >
                  View GitHub Profile
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
