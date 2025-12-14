// backend/scripts/bulkCreateCourses.js
// run: node --experimental-specifier-resolution=node scripts/bulkCreateCourses.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import CourseMeta from "../../models/CourseMeta.js"; // adjust path if your models are elsewhere

const MONGO = process.env.MONGO_URL;

const courses = [
  {
    course_id: "C0001",
    title: "Complete C Programming",
    category: "Programming Language",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/1Y9kVF8g/C0001.png",
    description: "A practical, hands-on course covering C from basics to advanced topics: arrays, pointers, memory model, structs and file I/O."
  },
  {
    course_id: "J0002",
    title: "Java Programming Masterclass",
    category: "Programming Language",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/YBhb27Lp/C0002.png",
    description: "Comprehensive Java course: OOP, collections, concurrency, JVM internals and building real applications."
  },
  {
    course_id: "R0003",
    title: "ReactJS Programming",
    category: "Frontend Development",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/FbfzMq1h/C0003.png",
    description: "Modern React development: hooks, context, routing, state management and building production apps with best practices."
  },
  {
    course_id: "A0004",
    title: "AngularJS Programming MasterClass",
    category: "Frontend Development",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/2YRPPhL8/C0004.png",
    description: "Angular deep-dive: components, rxjs, ngrx (state), forms, testing and deployment strategies."
  },
  {
    course_id: "DB0005",
    title: "DBMS Concepts",
    category: "Backend Development",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/B2TWN68f/C0005.png",
    description: "Database fundamentals: relational model, normalization, indexing, transactions, ACID and SQL tuning."
  },
  {
    course_id: "N0006",
    title: "NodeJS Backend Masterclass",
    category: "Backend Development",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/cS0kTX9s/C0006.png",
    description: "Node.js backend systems: express, middlewares, authentication, databases, testing and deployment."
  },
  {
    course_id: "S0007",
    title: "Sorting Algorithms Masterclass",
    category: "Data Structures & Algos.",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/fYfymkP7/C0007.png",
    description: "In-depth sorting algorithms: comparison sorts, non-comparison sorts, complexity analysis and real implementations in C."
  },
  {
    course_id: "T0008",
    title: "Trees & Graphs Masterclass",
    category: "Data Structures & Algos.",
    price: 1199,
    afterDiscountPrice: null,
    thumbnailUrl: "https://i.ibb.co/tMtgQR83/C0008.png",
    description: "Theory and practice for trees and graphs: traversals, shortest paths, MSTs, representations and algorithms."
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
