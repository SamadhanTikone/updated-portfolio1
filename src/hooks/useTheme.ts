import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing theme state and persistence
 * Handles light/dark theme toggling with localStorage persistence
 */
export const useTheme = () => {
  // State to track current theme - default to dark
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /**
   * Apply theme class to DOM element
   * @param isDark - Whether dark theme should be applied
   */
  const applyThemeToDOM = useCallback((isDark: boolean) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      body.classList.add("light");
      body.classList.remove("dark");
    }
  }, []);

  /**
   * Initialize theme from localStorage or default to dark
   * This effect runs once on component mount
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Try to get saved theme preference from localStorage
      const savedTheme = localStorage.getItem("theme-preference");

      if (savedTheme === "dark" || savedTheme === "light") {
        const isDark = savedTheme === "dark";
        setIsDarkMode(isDark);
        applyThemeToDOM(isDark);
      } else {
        // No valid saved preference, default to dark theme
        setIsDarkMode(true);
        applyThemeToDOM(true);
        localStorage.setItem("theme-preference", "dark");
      }
    } catch (error) {
      // localStorage might not be available, fallback to dark theme
      console.warn("localStorage not available, using dark theme as default");
      setIsDarkMode(true);
      applyThemeToDOM(true);
    }

    setIsInitialized(true);
  }, [applyThemeToDOM]);

  /**
   * Toggle between light and dark themes
   * Saves preference to localStorage and applies to DOM
   */
  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode;

    // Update state
    setIsDarkMode(newTheme);

    // Apply to DOM
    applyThemeToDOM(newTheme);

    // Save to localStorage for persistence
    try {
      localStorage.setItem("theme-preference", newTheme ? "dark" : "light");
    } catch (error) {
      console.warn("Failed to save theme preference to localStorage");
    }
  }, [isDarkMode, applyThemeToDOM]);

  /**
   * Set theme explicitly (useful for programmatic theme setting)
   * @param theme - "light" or "dark"
   */
  const setTheme = useCallback(
    (theme: "light" | "dark") => {
      const isDark = theme === "dark";

      // Update state
      setIsDarkMode(isDark);

      // Apply to DOM
      applyThemeToDOM(isDark);

      // Save to localStorage
      try {
        localStorage.setItem("theme-preference", theme);
      } catch (error) {
        console.warn("Failed to save theme preference to localStorage");
      }
    },
    [applyThemeToDOM],
  );

  /**
   * Get current theme as string
   * @returns "light" or "dark"
   */
  const currentTheme = isDarkMode ? "dark" : "light";

  /**
   * Get display text for current theme
   * @returns Display text for the opposite theme (what clicking would switch to)
   */
  const themeDisplayText = isDarkMode ? "Light Mode" : "Dark Mode";

  return {
    isDarkMode,
    currentTheme,
    themeDisplayText,
    toggleTheme,
    setTheme,
    isInitialized,
  };
};

export default useTheme;
