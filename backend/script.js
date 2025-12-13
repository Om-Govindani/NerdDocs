// backend/scripts/bulkCreateCourses.js
// run: node --experimental-specifier-resolution=node scripts/bulkCreateCourses.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import CourseMeta from "./models/CourseMeta.js"; // adjust path if your models are elsewhere

const MONGO = process.env.MONGO_URL;

const courses = [
  {
    course_id: "J0009",
    title: "Javascript Programming Masterclass",
    category: "Programming Language",
    price: 9999,
    afterDiscountPrice: 3999,
    thumbnailUrl: "https://i.ibb.co/d40b0tL7/C0009.png",
    description: "Go from novice to building dynamic web experiences using core JavaScript and modern ES6 features."
  },
  {
    course_id: "JE0010",
    title: "J2EE Backend Development",
    category: "Backend Development",
    price: 16999,
    afterDiscountPrice: 14999,
    thumbnailUrl: "https://i.ibb.co/4RXKmCLn/C0010.png",
    description: "Master the enterprise-level architecture of Java to build robust, scalable, and secure backend applications using servlets, JSP, and EJB."
  }
];

async function run() {
  if (!MONGO) {
    console.error("MONGO_URL not set in .env");
    process.exit(1);
  }
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to Mongo");

  for (const c of courses) {
    // upsert to avoid duplicates if run multiple times
    const existing = await CourseMeta.findOne({ course_id: c.course_id });
    if (existing) {
      console.log("Skipping existing:", c.course_id);
      continue;
    }
    await CourseMeta.create(c);
    console.log("Inserted:", c.course_id, c.title);
  }

  console.log("Done");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
