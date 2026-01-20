import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const dummyJobs = [
  {
    title: "Senior React Developer",
    company: "Pixel Perfect UI",
    location: "Remote",
    description: "Looking for a MERN expert to build high-end dashboards.",
    salary: "$120k - $150k",
    jobType: "Full-time"
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "DataStream",
    location: "New Delhi",
    description: "Help us scale our MongoDB clusters and Express APIs.",
    salary: "₹18L - ₹25L",
    jobType: "Hybrid"
  }
];

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    await Job.insertMany(dummyJobs);
    console.log("Success: Dummy jobs added!");
    process.exit();
  })
  .catch(err => console.log(err));