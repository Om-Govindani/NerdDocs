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

  async function fetchMe() {
    const res = await fetch("https://nerddocs-backend.vercel.app/api/auth/me", {
      credentials: "include",
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 401) {
      // try refresh
      const refreshRes = await fetch(
        "https://nerddocs-backend.vercel.app/api/auth/refresh",
        { credentials: "include" }
      );

      if (!refreshRes.ok) {
        throw new Error("Refresh failed");
      }

      // retry me
      const retry = await fetch("https://nerddocs-backend.vercel.app/api/auth/me", {
        credentials: "include",
      });

      if (!retry.ok) {
        throw new Error("Retry failed");
      }

      return retry.json();
    }

    throw new Error("Auth failed");
  }


  // On app load, check if user is already logged in (via cookies)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMe();
        if (data.success) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    })();
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
