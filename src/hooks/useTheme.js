import { useCallback, useState } from "react";

const KEY = "theme";
const read = () => {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

/** Light/dark theme stored on <html> (class) and in localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState(read);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.classList.replace(current, next);
      document.documentElement.classList.toggle("rs-theme-dark", next === "dark");
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
