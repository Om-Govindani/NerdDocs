import { useState, useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";
import OtpInput from "./OtpInput";

function AuthForm() {
  const [user, setUser] = useContext(AuthContext);
  const [theme] = useContext(ThemeContext);

  const isDark = theme === "dark";

  // UI States
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // loading state

  // Theme classes
  const themeClasses = {
    bg: isDark ? "bg-slate-950 text-white" : "bg-orange-50 text-slate-900",
    card: isDark ? "bg-slate-800 shadow-xl" : "bg-white shadow-2xl",
    input: isDark
      ? "bg-slate-700 text-white border-slate-600"
      : "bg-white border-slate-300",
    button:
      "bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-200",
    link: "text-orange-500 hover:text-orange-600 cursor-pointer text-sm mt-3",
  };

  // ------------------------------------
  //               API CALLS
  // ------------------------------------

  async function handleGetOTP(e) {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/request-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          purpose: isSigningUp ? "signup" : "login",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (!otp || otp.length !== 6) return setError("Enter the 6-digit OTP");

    try {
      const res = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          purpose: isSigningUp ? "signup" : "login",
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Backend has set cookies; just update React state
        setUser(data.user);

        // Reset form
        setOtpSent(false);
        setOtp("");
        setEmail("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  }

  // ------------------------------------
  //               UI HELPERS
  // ------------------------------------

  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 016-2.709L15 14l-3 3-2-2-4 4z"
      ></path>
    </svg>
  );

  // ------------------------------------
  //               RENDER UI
  // ------------------------------------

  return (
    <div className={`p-8 rounded-lg ${themeClasses.card} max-w-md w-full`}>
      <h2 className="text-3xl font-bold mb-6 text-center">
        {isSigningUp ? "Create Account" : "Welcome Back"}
      </h2>

      {/* EMAIL → OTP STEP */}
      {!otpSent && (
        <form onSubmit={handleGetOTP} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none ${themeClasses.input}`}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className={`${themeClasses.button} flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Loading...
              </>
            ) : (
              "Get OTP"
            )}
          </button>
        </form>
      )}

      {/* OTP INPUT STEP */}
      {otpSent && (
        <div className="flex flex-col gap-4">
          <p className="text-center mb-2">
            A 6-digit OTP has been sent to{" "}
            <span className="font-semibold">{email}</span>
          </p>

          <OtpInput otp={otp} setOtp={setOtp} themeClasses={themeClasses} />

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button onClick={handleVerifyOTP} className={themeClasses.button}>
            Verify OTP
          </button>
          <p className="text-center text-sm opacity-75">
            Wrong email?{" "}
            <a
              onClick={() => setOtpSent(false)}
              className={themeClasses.link}
            >
              Go Back
            </a>
          </p>
        </div>
      )}

      {/* SWITCH LOGIN <-> SIGNUP */}
      <div className="flex justify-center mt-4">
        <a
          onClick={() => {
            setIsSigningUp(!isSigningUp);
            setError("");
            setOtpSent(false);
          }}
          className={themeClasses.link}
        >
          {isSigningUp
            ? "Already have an account? Log In"
            : "Don't have an account? Create now"}
        </a>
      </div>
    </div>
  );
}

export default AuthForm;
