import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-sm transition-all hover:bg-background/80">
      <Sun className="h-4 w-4 text-orange-500 animate-pulse-slow" />
      <Switch
        id="theme-mode"
        checked={resolvedTheme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-accent/40"
      />
      <Moon className="h-4 w-4 text-blue-400" />
      <Label htmlFor="theme-mode" className="sr-only">Toggle theme</Label>
    </div>
  );
}
