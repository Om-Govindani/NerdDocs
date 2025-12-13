import CourseMeta from "../models/CourseMeta.js";
import CourseModule from "../models/CourseModule.js";
import ModuleTopic from "../models/ModuleTopic.js";
import TopicContent from "../models/TopicContent.js";

export const createCourse = async (req, res) => {
  try {
    const body = req.body;
    // validate minimal
    if (!body.course_id || !body.title) return res.status(400).json({ error: "Missing fields" });
    await CourseMeta.create(body);
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
};

export const createModule = async (req, res) => {
  try {
    const { module_id, course_id, module_title, order } = req.body;
    if (!module_id) return res.status(400).json({ error: "module_id required" });
    await CourseModule.create({ module_id, course_id, module_title, order });
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
};

// similar for topic/content
