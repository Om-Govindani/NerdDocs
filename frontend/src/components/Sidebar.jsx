import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import CatagoryContext from "../context/CatagoryContext";
import coursesData from "../data/courses.json"; // ← your JSON file

export default function Sidebar() {
  const [theme] = useContext(ThemeContext);
  const [catagory, setCatagory] = useContext(CatagoryContext);

  // Read categories dynamically from JSON
  const catagoryList = coursesData.categories.map((c) => c.name);

  return (
    <div
      className={`w-1/5 h-full border-r-[0.9px] ${
        theme === "dark"
          ? "border-r-gray-900"
          : "border-r-orange-200"
      }`}
    >
      <div className="mt-35 flex flex-col gap-4 px-2">

        {catagoryList.map((option, idx) => {
          const isActive = catagory === option;

          return (
            <div
              key={idx}
              onClick={() => setCatagory(option)}
              className={`
                h-15 w-full cursor-pointer flex items-center justify-center rounded-lg
                transition-all
                ${isActive ? "bg-orange-500/20" : ""}
              `}
            >
              <div
                className={`
                  w-[75%] text-left font-semibold text-md transition
                  ${
                    theme === "dark"
                      ? isActive
                        ? "text-orange-400"
                        : "text-white hover:text-orange-400"
                      : isActive
                        ? "text-orange-600"
                        : "text-slate-950 hover:text-orange-400"
                  }
                `}
              >
                {option}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
