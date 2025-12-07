import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

export default function ProfileDetails() {
  const [user, setUser] = useContext(AuthContext);
  const [theme] = useContext(ThemeContext);

  const isDark = theme === "dark";

  const themeClasses = {
    bg: isDark ? "bg-slate-950 text-white" : "bg-orange-100 text-slate-900",
    card: isDark ? "bg-slate-800 shadow-xl" : "bg-white shadow-lg",
    input: isDark
      ? "bg-slate-700 text-white border-slate-600"
      : "bg-white border-slate-300",
    button:
      "bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-200",
    link: "text-orange-500 hover:text-orange-600 cursor-pointer text-sm mt-3",
  };

  async function handleLogout() {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout failed", err);
    } finally {
      setUser(null);
    }
  }

  return (
    <div className={`p-8 rounded-lg ${themeClasses.card} h-full w-full`}>
      <h2 className="text-3xl font-bold mb-2">My Profile</h2>

      <p className="text-lg mb-6">
        Logged in as:{" "}
        <span className="font-semibold text-orange-500">{user.email}</span>
      </p>

      <h3 className="text-2xl font-semibold mb-4">Purchased Courses</h3>

      {user.myCourses && user.myCourses.length > 0 ? (
        <ul className="space-y-3">
          {user.myCourses.map((course, index) => (
            <li
              key={index}
              className={`p-3 rounded-md border-l-4 border-orange-500 ${
                isDark ? "bg-slate-700" : "bg-gray-100"
              }`}
            >
              {course}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg italic text-gray-400">
          You haven't enrolled in any course yet.
        </p>
      )}

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
      >
        Log Out
      </button>
    </div>
  );
}
