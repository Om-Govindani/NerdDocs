import UserCourses from "../models/UserCourses.js";
import CourseMeta from "../models/CourseMeta.js";

export const getMyCourses = async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const list = await UserCourses.find({ user_id: userId }).lean();
    const courseIds = list.map(l => l.course_id);
    const metas = await CourseMeta.find({ course_id: { $in: courseIds } }).lean();
    // merge completed flag
    const result = metas.map(m => {
      const rec = list.find(l => l.course_id === m.course_id);
      return { ...m, completed: rec?.completed || false };
    });
    res.json({ courses: result });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
};

export const getCourseStatus = async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { courseId } = req.params;
    const rec = await UserCourses.findOne({ user_id: userId, course_id: courseId });
    res.json({ purchased: !!rec, completed: !!rec?.completed });
  } catch (err) { res.status(500).json({ error: "Server error" }); }
};
