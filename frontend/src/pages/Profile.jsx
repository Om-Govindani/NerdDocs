// src/pages/Profile.jsx

import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import AuthForm from "../components/AuthForm";
import ProfileDetails from "../components/ProfileDetails";

function Profile() {
    const [theme, setTheme] = useContext(ThemeContext);
    const [user, setUser] = useContext(AuthContext);
    const isDark = theme === "dark";
    const themeClasses = {
        bg: isDark ? "bg-slate-950 text-white" : "bg-orange-50 text-slate-900",
        card: isDark ? "bg-slate-800 shadow-xl" : "bg-white shadow-3xl",
        input: isDark ? "bg-slate-700 text-white border-slate-600" : "bg-white border-slate-300",
        button: "bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-200",
        link: "text-orange-500 hover:text-orange-600 cursor-pointer text-sm mt-3"
    };  
    return (
        <div className={`${themeClasses.bg} w-full h-screen flex flex-col transition-all duration-300`}>
        <Navbar theme={theme} setTheme={setTheme} />

        {/* Adjusted padding-top to pt-24 (assuming Navbar height is around 5rem/20) */}
        <div className="flex flex-1 items-center justify-center pt-24 p-4"> 
            {user ? <ProfileDetails /> : <AuthForm />}
        </div>
        </div>
    );
}

export default Profile;