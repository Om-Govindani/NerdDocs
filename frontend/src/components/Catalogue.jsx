import { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import CatagoryContext from "../context/CatagoryContext";
import Loader from "./Loader";

export default function Catalogue({setLoading}) {
  const [catagory] = useContext(CatagoryContext);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!catagory) return; // agar kuch select hi nahi kiya

    const encoded = encodeURIComponent(catagory);

    async function fetchCatalogue() {
      try{
        setLoading(true);
        fetch(`https://nerddocs-backend.vercel.app/api/courses/by-category/${encoded}`)
          .then(res => {
            if (!res.ok) throw new Error("Category not found");
            return res.json();
          })
          .then(data => {
            setCourses(data.courses || []);
          })
          .catch(err => {
            console.error("Catalogue error:", err);
            setCourses([]);
          });
          
      }catch(err){
        console.log(err)
        setCourses([])
      } finally{
        setLoading(false);
      }
    }
    console.log(courses)
    fetchCatalogue()
  }, [catagory]);

  if(courses.length === 0) return <Loader />

  return (
    <div className="w-4/5 h-full overflow-y-auto px-6 py-6">

      <div className="h-15"></div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {
        courses.map(course => (
          <CourseCard
            key={course.course_id}
            course_id={course.course_id}
            thumbnail={course.thumbnailUrl || "/default.png"}
            title={course.title}
            price={course.price}
            details={course.description}
            discountedPrice={course.afterDiscountPrice}
          />
        ))}
      </div>

      <div className="h-10"></div>
    </div>
  );
}
