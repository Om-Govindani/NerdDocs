import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";


export default function CourseCard({
  course_id,
  thumbnail,
  title,
  price,
  details,
  disableNavigation = false,
  discountedPrice,
  buttonText = "View Details",
  onBuyNow
}) {
  const navigate = useNavigate();
  const [user, setUser] = useContext(AuthContext);

  const handleCardClick = () => {
    if (!course_id) return;
    if (!disableNavigation) {
      navigate(`/course/${course_id}`);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/profile");
      return;
    }

    if (!disableNavigation) {
      navigate(`/course/${course_id}`);
    }

    if (disableNavigation) {
      navigate(`/reader/${course_id}`);
    } else {
      onBuyNow?.();
    }
  };


  return (
    <div
      onClick={handleCardClick}
      className="w-[330px]  rounded-xl shadow-md shadow-gray-900/30 hover:shadow-xl hover:transition-all hover:duration-300 hover:shadow-gray-900/50 border-[0.5px] border-gray-800/40 bg-white overflow-hidden cursor-pointer transition"
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-55 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-sans leading-snug text-gray-800">
          {title}
        </h2>
        <div className="text-sm text-gray-600 font-sans pt-2">{details}</div>

        <div className="flex items-center mt-2 gap-x-1">
          <span className="text-sm text-gray-800 line-through decoration-red-400 decoration-2 font-sans">₹{price}</span>
          <span className="text-lg text-gray-800 font-sans">₹{discountedPrice}</span>
        </div>

        <button
          onClick={handleButtonClick}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600/90 text-white font-sans py-2 rounded-3xl transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
