import Icon from "@/components/ui/Icon";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
    </button>
  );
}
