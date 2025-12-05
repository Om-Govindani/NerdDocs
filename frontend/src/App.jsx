import Navbar from "./components/Navbar"
import {useState} from "react";
import Home from "./pages/Home";
import ThemeContext from "./context/ThemeContext";

function App() {
  const [theme , setTheme] = useState("light");
  return (
    <ThemeContext.Provider value = {[theme , setTheme]}>
      <Home />
    </ThemeContext.Provider>
  )
}

export default App
