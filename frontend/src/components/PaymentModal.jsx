export default function PaymentModal({ open, onClose, course, onPay }) {
  if (!open || !course) return null;

  const originalPrice = course.price;
  const finalPrice = course.afterDiscountPrice ?? course.price;
  const discount = originalPrice - finalPrice;
  const safeImage =
  course.thumbnailUrl?.startsWith("http")
    ? course.thumbnailUrl
    : "https://via.placeholder.com/600x400?text=Course";


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="relative">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-56 object-cover"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full px-3 py-1 text-lg hover:bg-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 leading-snug">
            {course.title}
          </h2>

          {/* Price section */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Course Price</span>
              <span className="line-through">₹{originalPrice}</span>
            </div>

            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>

            <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{finalPrice}</span>
            </div>
          </div>

          {/* Info note */}
          <div className="text-sm text-gray-500 leading-snug">
            Lifetime access • One-time payment • No hidden charges
          </div>

          {/* Pay Button */}
          <button
            onClick={onPay}
            className="w-full mt-2 bg-blue-500 hover:bg-blue-600/90 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
}
