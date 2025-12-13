import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CatagoryContext from "../context/CatagoryContext";

export default function Sidebar() {
  const [catagory, setCatagory] = useContext(CatagoryContext);
  const [catList, setCatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:5000/api/courses/categories");
        if (!res.ok) {
          console.error("Failed to fetch categories");
          return;
        }

        const data = await res.json();

        // Ensure correct structure + SORT alphabetically
        if (Array.isArray(data.categories)) {
          const sorted = [...data.categories].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setCatList(sorted);
        } else {
          console.error("Invalid category format:", data);
        }
      } catch (err) {
        console.error("API ERROR:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="w-64 bg-blue-50 text-gray-800 h-screen px-5 pt-8 border-r border-gray-200">
      <ul className="flex-col mt-55 space-y-4">
        {catList.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          catList.map((option, index) => {
            const isActive = catagory === option.name;
            return (
              <li
                key={index}
                onClick={() => setCatagory(option.name)}
                className={`cursor-pointer p-2 rounded-md transition 
                  ${
                    isActive
                      ? " text-blue-600 font-semibold"
                      : "hover:bg-blue-100"
                  }
                `}
              >
                {option.name}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
