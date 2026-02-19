import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("loopify-theme") || "loopify",
  setTheme: (theme) => {
    localStorage.setItem("loopify-theme", theme);
    set({ theme });
  },
}));