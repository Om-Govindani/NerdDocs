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
  onBuyNow,
  showInvoiceButton = false,     // 👈 NEW
  onDownloadInvoice                  // 👈 NEW
}) {
  const navigate = useNavigate();
  const [user] = useContext(AuthContext);

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

    if (disableNavigation) {
      navigate(`/reader/${course_id}`);
    } else {
      onBuyNow?.();
    }
  };

  const handleInvoiceClick = async (e) => {
    e.stopPropagation();
    onDownloadInvoice(course_id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-[330px] rounded-xl shadow-md border bg-white overflow-hidden cursor-pointer"
    >
      <img src={thumbnail} alt={title} className="w-full h-55 object-cover" />

      <div className="p-4">
        <h2 className="text-lg font-sans text-gray-800">{title}</h2>
        <div className="text-sm text-gray-600 pt-2">{details}</div>

        <div className="flex items-center mt-2 gap-x-1">
          <span className="line-through text-sm">₹{price}</span>
          <span className="text-lg">₹{discountedPrice}</span>
        </div>

        <button
          onClick={handleButtonClick}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-3xl"
        >
          {buttonText}
        </button>

        {/* 👇 INVOICE BUTTON */}
        {showInvoiceButton && (
          <button
            onClick={handleInvoiceClick}
            className="w-full mt-2 border border-blue-500 text-blue-600 py-2 rounded-3xl hover:bg-blue-50 cursor-pointer"
          >
            Download Invoice
          </button>
        )}
      </div>
    </div>
  );
}

