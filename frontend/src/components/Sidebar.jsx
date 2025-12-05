import {useContext} from "react";
import ThemeContext from "../context/ThemeContext";
import CatagoryContext from "../context/CatagoryContext";

export default function Sidebar(){

    const [theme] = useContext(ThemeContext);
    const [catagory , setCatagory] = useContext(CatagoryContext);

    const catagoryList = [
        "C Programming" , 
        "C++ Programming" , 
        "Java Programming" , 
        "Python Programming" , 
        "JavaScript Programming",
        "ReactJS Framework"
    ];

    return (
        <div className={`w-1/5 h-full border-r-[0.5px] 
            ${theme === "dark" ? "border-r-gray-900" : "border-r-white"}`}>

            <div className="mt-35 flex flex-col gap-4 px-2">
                {catagoryList.map((option , idx) => (
                    <div 
                        key={idx}
                        className="h-15 w-full cursor-pointer flex items-center justify-center rounded-lg"
                    >
                        <div className={`w-[75%] text-left font-semibold text-md ${theme === "dark" ? "text-white hover:text-orange-400" : "text-slate-950 hover:text-orange-400"}`}>
                            {option}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
