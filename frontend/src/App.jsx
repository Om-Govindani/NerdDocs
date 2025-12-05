import {useState} from "react";
import Home from "./pages/Home";
import ThemeContext from "./context/ThemeContext";
import CatagoryContext from "./context/CatagoryContext";

function App() {
  const [theme , setTheme] = useState("light");
  const [catagory , setCatagory] = useState("C Programming")
  return (
    <ThemeContext.Provider value = {[theme , setTheme]}>
      <CatagoryContext.Provider value = {[catagory , setCatagory]} >
        <Home />
      </CatagoryContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
