import { useEffect } from "react";
import { useStore } from "@/store";

export default function ThemeInitializer() {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    // Apply saved theme on first render
    setTheme(theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
