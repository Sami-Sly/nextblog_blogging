// "use client";

// import { useTheme } from "next-themes";
// import { Moon, Sun } from "lucide-react";
// import { useEffect, useState } from "react";

// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   return (
//     <button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="rounded-md border p-2 hover:bg-muted transition"
//       aria-label="Toggle theme"
//     >
//       {theme === "dark" ? (
//         <Sun className="h-5 w-5" />
//       ) : (
//         <Moon className="h-5 w-5" />
//       )}
//     </button>
//   );
// }

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-3 px-0 py-0 rounded-md hover:bg-accent transition w-fit"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}

      {/* Mobile drawer text only */}
      <span className="text-sm font-medium md:hidden">
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
