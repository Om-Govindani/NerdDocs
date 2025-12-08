import { useNavigate } from "react-router-dom";

export default function CourseCard({
  course_id,
  thumbnail,
  title,
  price,
  disableNavigation = false,
  buttonText = "View Details"
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disableNavigation) navigate(`/course/${course_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-[330px] rounded-xl shadow-xl hover:transition-all hover:duration-300 hover:shadow-gray-900/50 border-[0.5px] border-gray-800/40 bg-white overflow-hidden cursor-pointer transition"
    >
      <img src={thumbnail} alt={title} className="w-full h-55 object-cover" />

      <div className="p-4">
        <h2 className="text-lg font-sans leading-snug text-gray-800">
          {title}
        </h2>

        <div className="flex items-center mt-4">
          <span className="text-md font-sans">₹{price}</span>
        </div>

        <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600/90 text-white font-sans py-2 rounded-3xl transition">
          {buttonText}
        </button>
      </div>
    </div>
  );
}
