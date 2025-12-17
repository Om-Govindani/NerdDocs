import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import CourseCard from "../components/CourseCard";
import Loader from "./Loader";

export default function ProfileDetails() {
  const [user, setUser] = useContext(AuthContext);
  const [theme] = useContext(ThemeContext);
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";

  const themeClasses = {
    bg: isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900",
    card: isDark ? "bg-slate-800 shadow-xl" : "bg-white shadow-lg",
    button:
      "bg-blue-500 hover:bg-blue-600/90 text-white font-semibold py-2 px-4 rounded transition duration-200",
  };

  // ===============================
  // FETCH PURCHASED COURSES
  // ===============================
  useEffect(() => {
    async function fetchMyCourses() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://nerddocs-backend.vercel.app/api/user/my-courses",
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch courses");

        setMyCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        setMyCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMyCourses();
  }, []);

  // ===============================
  // LOGOUT
  // ===============================
  async function handleLogout() {
    try {
      await fetch("https://nerdocs-backend.vercel.app/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  }
  if(!myCourses) return <Loader />
  return (
    <div className={` relative p-4 rounded-lg ${themeClasses.card} w-full h-full`}>

      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-1 py-1 border-[0.5px] border-gray-400 w-18 rounded-md text-sm hover:bg-gray-100"
      >
        ← Back
      </button>

      {/* PROFILE HEADER */}
      <p className="text-lg mb-8">
        Logged in as{" "}
        <span className="font-semibold text-blue-500">
          {user?.email}
        </span>
      </p>

      {/* COURSES */}
      <h3 className="text-2xl font-semibold mb-6">Purchased Courses</h3>

      {loading ? (
        <Loader />
      ) : myCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-10">
          {myCourses.map((course) => (
            <CourseCard
              key={course.course_id}
              course_id={course.course_id}
              thumbnail={course.thumbnailUrl}
              title={course.title}
              price={course.price}
              discountedPrice={course.afterDiscountPrice}
              details={course.description}
              disableNavigation
              buttonText="Go To Course"
            />
          ))}
        </div>
      ) : (
        <p className="text-lg italic text-gray-400">
          You haven't enrolled in any course yet.
        </p>
      )}

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="absolute top-2 right-10 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition"
      >
        Log Out
      </button>
    </div>
  );
}
