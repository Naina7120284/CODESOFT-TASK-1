import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import applicationRoutes from './routes/applicationRoutes.js';
import contactRoute from './routes/contact.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

console.log("1. Environment variables loaded...");

const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} request received at: ${req.url}`);
  next();
});

app.use(cors({
  origin: [
    "http://localhost:5173",         
    "http://192.168.1.192:5173",
    "https://job-board-fojg.onrender.com",
    "https://job-board-naina.netlify.app"
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

console.log("2. Middlewares configured...");


app.use("/api/jobs", jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/applications', applicationRoutes);
app.use('/uploads', express.static('uploads'));
app.use(contactRoute);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.send("JOBBOARD Backend running and connected to Atlas");
});

console.log("3. Routes initialized...");

const MONGO_URL = process.env.MONGODB_URI || process.env.MONGO_URL; 

if (!MONGO_URL) {
  console.error("CRITICAL ERROR: MONGO_URL missing in .env!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("4. SUCCESS: Connected to MongoDB Atlas Cloud!"); 
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`5. Server is fully active on port ${PORT}`);
      console.log(`--- Ready for Login, Register, and Job Posting ---`);
    });
  })
  .catch((err) => {
    console.error("DB CONNECTION ERROR:", err);
    process.exit(1);
  });