"use client";

import { IconSwitch } from "@nndm/ui/icon-switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <IconSwitch
          id="dark-mode"
          disabled
          thumbContent={<Sun className="h-3 w-3 text-foreground" />}
        />
      </div>
    );
  }

  const isDarkMode = theme === "dark";

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <IconSwitch
        id="dark-mode"
        checked={isDarkMode}
        onCheckedChange={handleThemeChange}
        thumbContent={
          isDarkMode ? (
            <Moon className="h-3 w-3 text-foreground" />
          ) : (
            <Sun className="h-3 w-3 text-foreground" />
          )
        }
      />
    </div>
  );
}
