import { useState, useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";
import OtpInput from "./OtpInput";

function AuthForm() {
  const [user, setUser] = useContext(AuthContext);
  const [theme] = useContext(ThemeContext);

  const isDark = theme === "dark";

  // Sign Up adds FULL NAME field
  const [fullName, setFullName] = useState("");

  // UI States
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Theme classes (untouched)
  const themeClasses = {
    bg: isDark ? "bg-slate-950 text-white" : "bg-orange-50 text-slate-900",
    card: isDark ? "bg-slate-800 shadow-2xl" : "bg-blue-100/60 shadow-2xl",
    input: isDark
      ? "bg-slate-700 text-white border-slate-600"
      : "bg-white border-slate-300",
    button:
      "bg-blue-500 hover:bg-blue-600/90 text-white font-semibold py-2 px-4 rounded transition duration-200",
    link: "text-blue-500 hover:text-blue-600/90 cursor-pointer text-sm mt-3",
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

    // SIGNUP requires full name
    if (isSigningUp && fullName.trim().length < 3) {
      setError("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://nerddocs-backend.vercel.app/api/auth/request-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          purpose: isSigningUp ? "signup" : "login",
          fullName: isSigningUp ? fullName : undefined, // SEND NAME ONLY FOR SIGNUP
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtp("")
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
      const res = await fetch("https://nerddocs-backend.vercel.app/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          fullName: isSigningUp ? fullName : undefined, // Backend needs name during signup
          purpose: isSigningUp ? "signup" : "login",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);

        // RESET FIELDS
        setOtpSent(false);
        setOtp("");
        setEmail("");
        setFullName("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  }

  // ------------------------------------
  //               RENDER UI
  // ------------------------------------

  return (
    <div className={`p-8 rounded-lg ${themeClasses.card} max-w-md w-full`}>
      <h2 className="text-3xl font-bold mb-6 text-center">
        {isSigningUp ? "Create Account" : "Welcome Back"}
      </h2>

      {/* STEP 1: NAME + EMAIL → REQUEST OTP */}
      {!otpSent && (
        <form onSubmit={handleGetOTP} className="flex flex-col gap-4">

          {/* FULL NAME FIELD ONLY IN SIGNUP */}
          {isSigningUp && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${themeClasses.input}`}
                required
              />
            </div>
          )}

          {/* EMAIL FIELD */}
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
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${themeClasses.input}`}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className={`${themeClasses.button} flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP INPUT */}
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
            <a onClick={() => setOtpSent(false)} className={themeClasses.link}>
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
