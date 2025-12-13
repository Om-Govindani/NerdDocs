import ModuleTopic from "../models/ModuleTopic.js";
import CourseModule from "../models/CourseModule.js";
import UserCourses from "../models/UserCourses.js";

export const getModuleTopics = async (req, res) => {
  try {
    const { moduleId } = req.params;
    // find module to get course id
    const module = await CourseModule.findOne({ module_id: moduleId });
    if (!module) return res.status(404).json({ error: "Module not found" });

    // ownership check - course must be purchased
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const owned = await UserCourses.findOne({ user_id: String(userId), course_id: module.course_id });
    if (!owned) return res.status(403).json({ error: "Purchase required" });

    const topics = await ModuleTopic.find({ module_id: moduleId }).sort({ order: 1 }).select("-__v -_id");
    res.json({ topics });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
};
