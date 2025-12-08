import CourseCard from "./CourseCard";
import coursesData from "../data/courses.json"; // adjust path if needed
import { useContext } from "react";
import CatagoryContext from "../context/CatagoryContext";

export default function Catalogue() {
  const [catagory, setCatagory] = useContext(CatagoryContext);

  const cCategory = coursesData.categories.find(
    (cat) => cat.name === catagory
  );

  const courses = cCategory?.courses || [];

  return (
    <div className="w-4/5 h-full overflow-y-auto px-6 py-6">
      <div className="h-15"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.course_id}
            course_id={course.course_id}
            thumbnail={"/C-Cover.png"}
            title={course.title}
            price={course.price}
          />
        ))}
      </div>

      <div className="h-10"></div>
    </div>
  );
}
