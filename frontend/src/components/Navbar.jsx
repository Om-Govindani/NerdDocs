import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ theme, setTheme }) {
  const navigate = useNavigate();

  return (
    <div
      className="navbar fixed top-0 z-50 bg-blue-50 drop-shadow-3xl w-full h-16
                 flex items-center justify-between px-6 shadow-black/25 shadow-md"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={()=>navigate('/')}>
        <img 
          src={`${theme === "light" ? "/NerdDocs-light.png" : "/NerdDocs-dark.png"}`}
          className="h-12 w-auto"
        />

        <h1 className="text-2xl font-semibold">
          <span className="text-blue-600">N</span>
          <span className={`${theme === "dark" ? "text-white" : "text-slate-900"}`}>erd</span>
          <span className="text-blue-600">D</span>
          <span className={`${theme === "dark" ? "text-white" : "text-slate-900"}`}>ocs</span>
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* <ThemeToggle theme={theme} setTheme={setTheme} /> */}

        {/* Profile icon → navigate to /profile */}
        <FaUserCircle
          className={`text-4xl cursor-pointer ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}

export default Navbar;
