import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ThemeContext from "../context/ThemeContext";
import CourseCard from "../components/CourseCard";

export default function CourseDetails() {
  const { id } = useParams(); // course_id
  const [theme, setTheme] = useContext(ThemeContext);

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const metaRes = await fetch(
          `http://localhost:5000/api/courses/${id}/meta`,
          { credentials: "include" }
        );
        const meta = await metaRes.json();

        const moduleRes = await fetch(
          `http://localhost:5000/api/courses/${id}/outline`
        );
        const moduleData = await moduleRes.json();

        setCourse({
          ...meta,
          modules: moduleData.modules
        });
      } catch (err) {
        console.error(err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-10">Loading…</div>;
  if (!course) return <div className="p-10 text-xl">Course not found</div>;
  return (
  <div className="bg-blue-50 w-full h-screen">
    <Navbar theme={theme} setTheme={setTheme} />

    {/* TOP STRIP */}
    <div className="bg-blue-50 pt-24 pb-32 px-16 relative">
      <h1 className="text-4xl font-semibold">{course.title}</h1>

      {/* Floating Card */}
      <div className="absolute right-32 top-32">
        <CourseCard
          course_id={course.course_id}
          thumbnail={course.thumbnailUrl}
          title={course.title}
          price={course.price}
          disableNavigation
          buttonText="Buy Now"
        />
      </div>
    </div>

    {/* MODULE LIST */}
    <div className="bg-white px-40 py-20">
      {course.modules.map((mod) => (
        <div key={mod.module_id} className="mb-12">
          <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-3 mb-4">
            {mod.module_title}
          </h2>

          <div className="ml-6 border-l pl-6 flex flex-col gap-2">
            {mod.topics.map((topic) => (
              <div key={topic.topic_id} className="text-lg font-medium">
                • {topic.topic_name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}