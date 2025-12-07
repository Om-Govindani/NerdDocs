import { useState, useContext, useEffect } from "react";
export default function OtpInput ({ otp, setOtp, length = 6, themeClasses }) {
  const inputRefs = Array(length).fill(0).map(() => useState(null)[1]);
  
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value) || value.length > 1) return; // Only allow single digits

    const newOtpArray = otp.split('');
    newOtpArray[index] = value;
    const newOtp = newOtpArray.join('');
    setOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < length - 1) {
      inputRefs[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // If backspace is pressed on an empty field, move to the previous field
      inputRefs[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={otp[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          // ref={(el) => (inputRefs[index] = el)} // Using refs like this is not standard React Hook practice
          // Using ref management like this for a short component is simplified:
          ref={(el) => (inputRefs[index] = el)} 
          className={`w-10 h-12 text-center text-xl font-mono border rounded-md caret-transparent 
                      focus:ring-2 focus:ring-orange-500 outline-none ${themeClasses.input} 
                      ${themeClasses.bg === "bg-slate-950 text-white" ? "bg-slate-700" : "bg-white"}
                      text-white-caret`}
          style={{ 
            boxShadow: `0 0 0 1px ${themeClasses.input.includes("border-slate-600") ? '#475569' : '#d1d5db'}` 
          }}
        />
      ))}
    </div>
  );
};