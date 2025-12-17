import CourseMeta from "../models/CourseMeta.js";
import CourseModule from "../models/CourseModule.js";
import UserCourses from "../models/UserCourses.js";
import ModuleTopic from "../models/ModuleTopic.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await CourseMeta.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } }
    ]);
    res.json({ categories });
  } catch (err) { res.status(500).json({ error: "Server error" }); }
};

export const getCourses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const metas = await CourseMeta.find(filter).select("-__v -description");
    const userId = req.user?.userId;

    let courses = metas.map(m => ({ ...m.toObject(), isPurchased: false }));
    if (userId) {
      const userCourses = await UserCourses.find({ user_id: String(userId) }).select("course_id");
      const owned = new Set(userCourses.map(u=>u.course_id));
      courses = courses.map(c => ({ ...c, isPurchased: owned.has(c.course_id) }));
    }
    res.json({ courses });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
};

export const getCoursesByCategory = async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);

    const courses = await CourseMeta.find({ 
      category: { $regex: new RegExp("^" + category + "$", "i") }
    });

    console.log(courses)

    if (!courses.length) {
      return res.status(404).json({ error: "No courses found for this category" });
    }

    res.json({ success: true, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getCourseMeta = async (req, res) => {
  try {
    const { courseId } = req.params;
    const meta = await CourseMeta.findOne({ course_id: courseId }).lean();
    if (!meta) return res.status(404).json({ error: "Course not found" });
    const userId = req.user?.userId;
    let isPurchased = false;
    if (userId) {
      isPurchased = !!(await UserCourses.findOne({ user_id: String(userId), course_id: courseId }));
    }
    res.json({ ...meta, isPurchased });
  } catch (err) { res.status(500).json({ error: "Server error" }); }
};

export const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await CourseModule.find({ course_id: courseId }).sort({ order: 1 }).select("-__v -_id");
    res.json({ modules });
  } catch (err) { res.status(500).json({ error: "Server error" }); }
};

// GET /api/courses/:courseId/outline
export const getCourseOutline = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await CourseModule
      .find({ course_id: courseId })
      .sort({ order: 1 })
      .lean();

    const moduleIds = modules.map(m => m.module_id);

    const topics = await ModuleTopic
      .find({ module_id: { $in: moduleIds } })
      .sort({ order: 1 })
      .lean();

    const modulesWithTopics = modules.map(mod => ({
      ...mod,
      topics: topics.filter(t => t.module_id === mod.module_id)
    }));
    res.json({ modules: modulesWithTopics });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch outline" });
  }
};
