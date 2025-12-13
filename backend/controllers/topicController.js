import TopicContent from "../models/TopicContent.js";
import ModuleTopic from "../models/ModuleTopic.js";
import CourseModule from "../models/CourseModule.js";
import UserCourses from "../models/UserCourses.js";

export const getTopicContent = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await ModuleTopic.findOne({ topic_id: topicId });
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const module = await CourseModule.findOne({ module_id: topic.module_id });
    if (!module) return res.status(500).json({ error: "Internal mapping missing" });

    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const owned = await UserCourses.findOne({ user_id: String(userId), course_id: module.course_id });
    if (!owned) return res.status(403).json({ error: "Purchase required" });

    const content = await TopicContent.findOne({ topic_id: topicId }).lean();
    if (!content) return res.status(404).json({ error: "Content not found" });

    res.json({ topic, content });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
};
