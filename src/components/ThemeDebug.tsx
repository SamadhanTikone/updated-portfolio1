import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "./ThemeToggle";

/**
 * Debug component to test theme functionality
 * Remove this component in production
 */
const ThemeDebug = () => {
  const { isDarkMode, currentTheme, themeDisplayText, isInitialized } =
    useTheme();

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-64 bg-card border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">Theme Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          <p>Initialized: {isInitialized ? "✅" : "❌"}</p>
          <p>Current: {currentTheme}</p>
          <p>Is Dark: {isDarkMode ? "✅" : "❌"}</p>
          <p>Next: {themeDisplayText}</p>
          <p>
            HTML Class:{" "}
            {typeof document !== "undefined"
              ? document.documentElement.className
              : "N/A"}
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <ThemeToggle showLabel size="default" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeDebug;
