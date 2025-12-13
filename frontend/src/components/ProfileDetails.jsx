import { useContext } from "react";
import {useNavigate} from "react-router-dom"
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

export default function ProfileDetails() {
  const [user, setUser] = useContext(AuthContext);
  const [theme] = useContext(ThemeContext);
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const themeClasses = {
    bg: isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900",
    card: isDark ? "bg-slate-800 shadow-xl" : "bg-white shadow-lg",
    input: isDark
      ? "bg-slate-700 text-white border-slate-600"
      : "bg-white border-slate-300",
    button:
      "bg-blue-500 hover:bg-blue-600/90 text-white font-semibold py-2 px-4 rounded transition duration-200",
    link: "text-blue-500 hover:text-blue-600/90 cursor-pointer text-sm mt-3",
  };

  async function handleLogout() {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
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
      <p className="text-md mb-8 font-semibold h-8 flex items-center justify-center w-16 rounded-sm border-2 bg-blue-100  border-gray-200 cursor-pointer"
        onClick={()=>navigate("/")}
      >Back</p>
      <h2 className="text-3xl font-bold mb-2">My Profile</h2>
     
      <p className="text-lg mb-6">
        Logged in as:{" "}
        <span className="font-semibold text-blue-500">{user.email}</span>
      </p>

      <h3 className="text-2xl font-semibold mb-4">Purchased Courses</h3>

      {user.myCourses && user.myCourses.length > 0 ? (
        <ul className="space-y-3">
          {user.myCourses.map((course, index) => (
            <li
              key={index}
              className={`p-3 rounded-md border-l-4 border--500 ${
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
