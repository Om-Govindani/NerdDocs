import Catalogue from "../components/Catalogue";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ThemeContext from "../context/ThemeContext";
import {useContext} from "react"

function Home(){
    const [ theme , setTheme] = useContext(ThemeContext)
    return (
        <div className={`${theme === "dark" ? "bg-slate-950" : "bg-orange-100"} w-full h-screen flex-col transition-all duration-300`}>
            <Navbar theme={theme} setTheme={setTheme}/>
            <div className="flex flex-1 w-full h-full gap-x-1">
                <Sidebar />
                <Catalogue />
            </div>
        </div>
    )
}

export default Home;