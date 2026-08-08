import { useState } from "react";
import { useStore } from "@/store";
import { api } from "@/services/api";

export default function DemoSandboxBar() {
  const { currentStudent, fetchCurrentStudent, fetchAICoachInsight, isBackendConnected } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [simulatedDate, setSimulatedDate] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleSimulateMissedYesterday = async () => {
    setLoading(true);
    try {
      // Override system date to 2026-08-08 while last submission was 2026-08-06
      await api.setSystemDate("2026-08-08");
      setSimulatedDate("2026-08-08");
      await fetchCurrentStudent(currentStudent.id || "student-missed");
      await fetchAICoachInsight();
      showToast("📅 System date set to 2026-08-08. Student now shows missed yesterday!");
    } catch (err: any) {
      showToast(`⚠️ Override error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDateOverride = async () => {
    setLoading(true);
    try {
      await api.setSystemDate(null);
      setSimulatedDate(null);
      await fetchCurrentStudent(currentStudent.id);
      await fetchAICoachInsight();
      showToast("✅ System date override cleared.");
    } catch (err: any) {
      showToast(`⚠️ Error clearing date: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSpendFreezeToken = async () => {
    setLoading(true);
    try {
      await api.recoverStreak(currentStudent.id || "student-missed");
      await fetchCurrentStudent(currentStudent.id);
      showToast("🔥 Spent 1 Streak Freeze Token! Streak preserved & recovered!");
    } catch (err: any) {
      showToast(`⚠️ Freeze token failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSeedStore = async () => {
    setLoading(true);
    try {
      await api.resetAdminStore();
      setSimulatedDate(null);
      await fetchCurrentStudent("student-far");
      await fetchAICoachInsight();
      showToast("🔄 Backend database reset to initial seed state!");
    } catch (err: any) {
      showToast(`⚠️ Reset failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 border-b border-indigo-500/20 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            ⚡ Live Demo Sandbox
          </span>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${isBackendConnected ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
            {isBackendConnected ? "REST API Connected (port 3001)" : "Mock Data Mode"}
          </span>

          {simulatedDate && (
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-semibold">
              Date Override: {simulatedDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {message && (
            <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded animate-fade-in font-medium">
              {message}
            </span>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
          >
            {isOpen ? "Hide Tools ▲" : "Controls ▼"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-slate-950/90 border-t border-slate-800 p-4 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-semibold text-slate-300 mb-1">📅 Simulate Missed Day</div>
              <p className="text-[11px] text-slate-400 mb-2">Override system date to test missed yesterday detection.</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={loading}
                onClick={handleSimulateMissedYesterday}
                className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] transition disabled:opacity-50"
              >
                Simulate Missed
              </button>
              {simulatedDate && (
                <button
                  disabled={loading}
                  onClick={handleClearDateOverride}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-semibold text-slate-300 mb-1">🧊 Streak Freeze Token</div>
              <p className="text-[11px] text-slate-400 mb-2">Tokens available: {currentStudent.streakFreezeTokens ?? 1}</p>
            </div>
            <button
              disabled={loading || (currentStudent.streakFreezeTokens ?? 0) <= 0}
              onClick={handleSpendFreezeToken}
              className="w-full py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-[11px] transition disabled:opacity-50"
            >
              Spend 1 Freeze Token
            </button>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-semibold text-slate-300 mb-1">🔄 Reset Seed Store</div>
              <p className="text-[11px] text-slate-400 mb-2">Reset backend database to clean initial state.</p>
            </div>
            <button
              disabled={loading}
              onClick={handleResetSeedStore}
              className="w-full py-1.5 px-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded font-medium text-[11px] transition disabled:opacity-50"
            >
              Reset Seed Data
            </button>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-semibold text-slate-300 mb-1">👤 Active Student Persona</div>
              <p className="text-[11px] text-slate-400 mb-1">{currentStudent.name} ({currentStudent.id})</p>
              <div className="text-[11px] text-indigo-400 font-semibold">Streak: {currentStudent.streak} days · XP: {currentStudent.xp}</div>
            </div>
            <button
              disabled={loading}
              onClick={() => fetchCurrentStudent(currentStudent.id === "student-far" ? "student-missed" : "student-far")}
              className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
            >
              Switch Persona ({currentStudent.id === "student-far" ? "Taylor Vance" : "Alex Mercer"})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
