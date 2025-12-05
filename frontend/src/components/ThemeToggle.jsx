import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={toggle}
      className={`
        flex items-center justify-center
        h-10 w-10 rounded-full 
        backdrop-blur-md border 
        transition-all duration-300
        border-slate-300
        ${theme === "dark" ? "bg-slate-800" : "bg-amber-200"}
      `}
    >
      {isDark ? (
        <FaSun size={18} className="text-amber-300" />
      ) : (
        <FaMoon size={16} className="text-slate-800" />
      )}
    </motion.button>
  );
}

export default ThemeToggle;
