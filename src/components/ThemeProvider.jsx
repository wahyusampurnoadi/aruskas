"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";

const STORAGE_KEY = "aruskas-theme";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // null = belum dibaca dari localStorage / preferensi sistem
  const [theme, setTheme] = useState(null);

  // Baca tema tersimpan, atau ikuti preferensi sistem
  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? "light" : "dark");
  }, []);

  // Terapkan kelas ke <html>
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = (prev ?? "dark") === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme: theme ?? "dark", toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <Toaster
        theme={value.theme}
        position="top-right"
        richColors
        expand
        closeButton
      />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}