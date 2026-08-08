import { useEffect } from "react";
import { useStore } from "@/store";

export default function ThemeInitializer() {
  const { theme, setTheme, fetchCurrentStudent, fetchLeaderboard, fetchAICoachInsight } = useStore();

  useEffect(() => {
    // Apply saved theme on first render
    setTheme(theme);
    // Fetch live backend data
    fetchCurrentStudent();
    fetchLeaderboard();
    fetchAICoachInsight();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
