import Catalogue from "../components/Catalogue";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ThemeContext from "../context/ThemeContext";
import {useContext, useState} from "react"

function Home(){
    const [ theme , setTheme] = useContext(ThemeContext)
    const [loading , setLoading] = useState(true)
    return (
        <div className={`${theme === "dark" ? "bg-slate-950" : "bg-white"} w-full h-screen flex-col transition-all duration-300`}>
            <Navbar theme={theme} setTheme={setTheme}/>
            <div className="flex flex-1 w-full h-full gap-x-1">
                <Sidebar />
                <Catalogue setLoading = {setLoading}/>
            </div>
        </div>
    )
}

export default Home;