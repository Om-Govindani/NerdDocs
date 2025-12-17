import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ThemeContext from "../context/ThemeContext";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";
import PaymentModal from "../components/PaymentModal";


export default function CourseDetails() {
  const { id } = useParams(); // course_id
  const [theme, setTheme] = useContext(ThemeContext);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCourse() {
      let alive = true; // refresh / unmount safety
      try {
        setLoading(true);

        const metaRes = await fetch(
          `https://nerddocs-backend.vercel.app/api/courses/${id}/meta`,
          { credentials: "include" }
        );
        const meta = await metaRes.json();

        const moduleRes = await fetch(
          `https://nerddocs-backend.vercel.app/api/courses/${id}/outline`
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

  async function handlePayment() {
    try {
      // 1. Create order
      const res = await fetch("https://nerdocs-backend.vercel.app/api/order/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: course.course_id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      setShowPaymentModal(false);

      // 2. Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "NerdDocs",
        description: data.courseTitle,
        order_id: data.orderId,

        image: data.thumbnailUrl,

        // 👇 THIS ENABLES EVERYTHING CLEANLY
        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: true,
          paylater: true,
        },

        // 👇 UPI intent + collect support
        upi: {
          flow: "collect", // or "intent"
        },

        handler: async function (response) {
          const verifyRes = await fetch("https://nerdocs-backend.vercel.app/api/order/verify", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          window.location.href = `/reader/${course.course_id}`;
        },

        modal: {
          ondismiss: function () {
            console.log("Checkout closed");
          },
        },
      };


      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed");
      console.error(err);
    }
  }


  if (loading) return <Loader />;
  if (!course) return <div className="p-10 text-xl">Course not found</div>;
  return (
  <div className="bg-blue-50 w-full h-screen">
    <Navbar theme={theme} setTheme={setTheme} />

    {/* TOP STRIP */}
    <div className="bg-blue-50 pt-38 pb-25 px-32 relative">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-1 py-1 border-[0.5px] border-gray-400 w-18 rounded-md text-sm hover:bg-gray-100"
      >
        ← Back
      </button>
      <h1 className="text-4xl font-semibold font-sans">{course.title}</h1>

      {/* Floating Card */}
      <div className="absolute right-32 top-32">
        <CourseCard
          course_id={course.course_id}
          thumbnail={course.thumbnailUrl}
          title={course.title}
          price={course.price}
          discountedPrice={course.afterDiscountPrice}
          details={course.description}
          disableNavigation={course.isPurchased}
          buttonText={course.isPurchased ? "Go To Course" : "Buy Now"}
          onBuyNow={() => setShowPaymentModal(true)}
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
    <PaymentModal
      open={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      course={course}
      onPay={handlePayment}
    />

  </div>
);
}