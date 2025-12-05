import ThemeToggle from "./ThemeToggle";

function Navbar({ theme, setTheme }) {
  return (
    <div
      className="navbar fixed top-0 z-50 bg-transparent drop-shadow-3xl w-full h-20 rounded-t-3xl
                 flex items-center justify-between px-6"
      style={{ backdropFilter: "blur(4px)" }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3 transition-all duration-300">
        <img 
          src={`${theme === "light" ? "/NerdDocs-light.png" : "/NerdDocs-dark.png"}`}
          alt="Logo"
          className="h-14 w-auto object-contain transition-all duration-300"
        />

        <h1 className="text-2xl font-semibold tracking-wide select-none transition-all duration-300">
          <span className="text-orange-500">N</span>
          <span className={`${theme == "dark" ? "text-white" : "text-slate-950"} transition-all duration-300`}>erd</span>
          <span className="text-orange-500">D</span>
          <span className={`${theme == "dark" ? "text-white" : "text-slate-950"} transition-all duration-300`}>ocs</span>
        </h1>
      </div>

      <ThemeToggle theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default Navbar;
