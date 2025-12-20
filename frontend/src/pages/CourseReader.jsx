import { useEffect, useState, useContext } from "react";
import { useParams ,useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import ThemeContext from "../context/ThemeContext";
import Loader from "../components/Loader";

export default function CourseReader() {
  const { courseId } = useParams();
  const [theme, setTheme] = useContext(ThemeContext);
  const navigate = useNavigate();

  const [showHint, setShowHint] = useState(false);
  const [modules, setModules] = useState([]);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [loading , setLoading] = useState(true);

  const [allowed, setAllowed] = useState(null); // null = checking

  useEffect(() => {
    async function checkAccess() {
      try {
        
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/course/${courseId}/status`,
          { credentials: "include" }
        );
        if (!res.ok) {
          navigate(`/course/${courseId}`);
          return;
        }

        const data = await res.json();

        if (!data.purchased) {
          navigate(`/course/${courseId}`);
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error(err);
        navigate(`/course/${courseId}`);
      }
    }

    checkAccess();
  }, [courseId]);

  // ===============================
  // FETCH FULL COURSE READER DATA
  // ===============================
  // FETCH READER DATA (depends on allowed)
useEffect(() => {
  if (!allowed) return;

  async function fetchReader() {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reader/${courseId}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setModules(data.modules || []);

      if (data.modules?.length && data.modules[0].topics?.length) {
        setOpenModuleId(data.modules[0].module_id);
        setActiveTopic(data.modules[0].topics[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchReader();
}, [allowed, courseId]);

  if(!allowed || loading || !modules ) return <Loader />

  return (
    <div className="w-full h-screen flex bg-white">
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="flex w-full mt-16">
        {/* ================= SIDEBAR ================= */}
        <div className="w-[280px] h-[calc(100vh-64px)] overflow-y-auto  p-4 bg-blue-50">
          <p className="text-md mb-8 font-semibold h-8 flex items-center justify-center w-16 rounded-sm border-2 bg-blue-100  border-gray-200 cursor-pointer"
            onClick={()=>navigate(`/course/${courseId}`)}
          >Back</p>
          <h2 className="font-bold mb-4">Course Content</h2>

          {modules.map((mod) => (
            <div key={mod.module_id} className="mb-3">
              {/* MODULE HEADER */}
              <div
                onClick={() =>
                  setOpenModuleId(
                    openModuleId === mod.module_id
                      ? null
                      : mod.module_id
                  )
                }
                className="flex justify-between items-center cursor-pointer px-2 py-2 rounded hover:bg-blue-100"
              >
                <span className="font-semibold">
                  {mod.module_title}
                </span>
                {openModuleId === mod.module_id ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>

              {/* TOPICS */}
              {openModuleId === mod.module_id && (
                <div className="ml-4 mt-2 border-l pl-3">
                  {mod.topics.map((topic) => (
                    <div
                      key={topic.topic_id}
                      onClick={() => setActiveTopic(topic)}
                      className={`cursor-pointer py-1 text-sm ${
                        activeTopic?.topic_id === topic.topic_id
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-500"
                      }`}
                    >
                      {topic.topic_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-10">
          {!activeTopic ? (
            <p className="text-gray-500 items-center ">
              Loading Data
            </p>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">
                {activeTopic.topic_name}
              </h1>

              {/* ===== THEORY BLOCKS ===== */}
              {Array.isArray(activeTopic.blocks) &&
                activeTopic.blocks.map((block, idx) => {
                  if (block.type === "paragraph") {
                    return (
                      <p key={idx} className="text-lg leading-relaxed mb-4">
                        {block.value}
                      </p>
                    );
                  }

                  if (block.type === "heading") {
                    return (
                      <h2
                        key={idx}
                        className={`text-${block.level || 2}xl font-semibold mt-6 mb-3`}
                      >
                        {block.value}
                      </h2>
                    );
                  }

                  if (block.type === "list") {
                    return (
                      <ul key={idx} className="list-disc ml-6 mb-4">
                        {block.items?.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    );
                  }

                  return null;
                })}

              {/* ===== CODE SNIPPET ===== */}
              {activeTopic.code_snippet && (
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold mb-3">
                    Code Example
                  </h2>

                  <pre className="bg-slate-900 text-green-400 p-8 rounded overflow-x-auto">
                    {activeTopic.code_snippet.code}
                  </pre>
                </div>
              )}

              {/* ===== ASSIGNMENT ===== */}
              {activeTopic.assignment && (
                <div
                  className={`mt-10 p-6 border rounded-lg transition-all duration-300 ${
                    "bg-blue-50"
                  }`}
                >
                  <h2 className="text-2xl font-semibold mb-3">
                    Assignment
                  </h2>

                  <p className="text-lg mb-4">
                    {activeTopic.assignment.question}
                  </p>

                  {/* HINT TOGGLE */}
                  <div
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 cursor-pointer text-blue-600 font-medium select-none"
                  >
                    <ChevronRight
                      size={18}
                      className={`transition-transform duration-300 ${
                        showHint ? "rotate-90" : ""
                      }`}
                    />
                    <span>Hint</span>
                  </div>

                  {/* HINT CONTENT */}
                  {showHint && (
                    <div className="mt-4 p-4 bg-white border rounded-md text-gray-800">
                      <p className="text-sm leading-relaxed">
                        {activeTopic.assignment.expected_output_hint}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>

        
        </div>
      </div>
  );
}
