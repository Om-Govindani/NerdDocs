import { useParams } from "react-router-dom";
import { useContext } from "react";
import coursesData from "../data/courses.json";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ThemeContext from "../context/ThemeContext";
import CourseCard from "../components/CourseCard";

export default function CourseDetails() {
  const { id } = useParams();
  const [theme , setTheme] = useContext(ThemeContext);

  // UNIVERSAL COURSE SEARCH
  const allCourses = coursesData.categories.flatMap((cat) => cat.courses);
  const course = allCourses.find((c) => c.course_id === id);

  if (!course) return <div className="p-10 text-xl">Course not found.</div>;

  return (
    <div
      className={`${
        theme === "dark" ? "bg-slate-950" : "bg-orange-50"
      } w-full h-screen flex-col transition-all duration-300`}
    >
      {/* NAVBAR */}

      <div className="flex w-full h-full ">
        <Navbar theme={theme} setTheme={setTheme}/>

        {/* RIGHT CONTENT SECTION */}
        <div className="w-full h-full overflow-y-auto relative mt-15">

          {/* Top Orange Strip */}
          <div
            className={`w-full ${
              theme === "dark" ? "bg-slate-800" : "bg-orange-50"
            } pb-28 pt-10 px-8`}
          >
            <h1 className={` absolute left-20 mt-10 text-4xl ${theme === "dark" ? "text-white" : ""} font-semibold tracking-tight text-center`}>
              {course.title}
            </h1>
          </div>

          {/* FLOATING COURSE CARD */}
          <div className="absolute right-35 -mt-20">
            <CourseCard
              course_id={course.course_id}
              thumbnail="/C-Cover.png"
              title={course.title}
              price={course.price}
              disableNavigation={true}
              buttonText="Buy Now"
            />
          </div>

          {/* WHITE / DARK AREA WITH MODULES */}
          <div
            className={`w-full pt-20 px-40 pb-20 ${
              theme === "dark" ? "bg-slate-950" : "bg-white"
            }`}
          >
            {course.modules.map((module, idx) => (
              <div key={idx} className="mb-12">
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-3">
                  {module.module_title}
                </h2>

                <div className="ml-6 border-l border-slate-400 dark:border-slate-700 pl-6 flex flex-col gap-3">
                  {module.topics.map((topic, tid) => (
                    <div key={tid} className="text-lg font-medium">
                      • {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
