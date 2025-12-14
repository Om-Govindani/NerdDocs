import CourseModule from "../models/CourseModule.js";
import ModuleTopic from "../models/ModuleTopic.js";
import TopicContent from "../models/TopicContent.js";


export const getCourseReader = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await CourseModule.find({ course_id: courseId })
      .sort({ order: 1 })
      .lean();

    for (const mod of modules) {
      const topics = await ModuleTopic.find({
        module_id: mod.module_id,
      })
        .sort({ order: 1 })
        .lean();

      for (const topic of topics) {
        const topicContent = await TopicContent.findOne({
          topic_id: topic.topic_id,
        }).lean();

        topic.blocks = topicContent?.blocks || [];
      }

      mod.topics = topics;
    }

    res.json({ modules });
  } catch (err) {
    console.error("Reader error:", err);
    res.status(500).json({ error: "Failed to load reader" });
  }
};

export const getReaderOutline = async (req, res) => {
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

    const outline = modules.map(m => ({
      ...m,
      topics: topics.filter(t => t.module_id === m.module_id)
    }));

    res.json({ modules: outline });
  } catch (err) {
    res.status(500).json({ error: "Reader outline failed" });
  }
};

export const getTopicContent = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await ModuleTopic.findOne({ topic_id: topicId }).lean();
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const content = await TopicContent
      .find({ topic_id: topicId })
      .sort({ order: 1 })
      .lean();

    res.json({ topic, content });
  } catch (err) {
    res.status(500).json({ error: "Topic content failed" });
  }
};
