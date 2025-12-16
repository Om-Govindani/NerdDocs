// src/App.jsx

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ThemeContext from "./context/ThemeContext";
import CatagoryContext from "./context/CatagoryContext";
import AuthContext from "./context/AuthContext";
import CourseDetails from "./pages/CourseDetails";
import CourseReader from "./pages/CourseReader";

function App() {
  const [theme, setTheme] = useState("light");
  const [catagory, setCatagory] = useState("Programming Language");
  const [user, setUser] = useState(null);

  // On app load, check if user is already logged in (via cookies)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("https://nerddocs-backend.vercel.app/api/auth/me", {
        // const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include", // IMPORTANT for cookies
        });

        const data = await res.json();
        console.log(data);
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("Not logged in or /auth/me failed");
      }
    }

    fetchUser();
  }, []);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <CatagoryContext.Provider value={[catagory, setCatagory]}>
        <AuthContext.Provider value={[user, setUser]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/reader/:courseId" element={<CourseReader />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </CatagoryContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
