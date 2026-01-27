import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    updateApplicationStatus, 
    submitApplication, 
    getCandidateApplications 
} from '../controllers/applicationController.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js'; 

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
router.post('/submit', upload.single('resume'), submitApplication);
router.get('/user/:candidateId', getCandidateApplications);
router.get('/employer/:employerId', async (req, res) => {
    try {
        const { employerId } = req.params;
        const jobs = await Job.find({ employerId: employerId });
        const jobIds = jobs.map(job => job._id);
        const applications = await Application.find({ jobId: { $in: jobIds } });
        
        res.status(200).json(applications);
     }   catch (err) {
        console.error("Application route error:", err);
        res.status(500).json({ message: "Server error", error: err });
      }
  });
router.put('/status/:appId', updateApplicationStatus);
router.post('/save-job', async (req, res) => {
    const { userId, jobId } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedJobs: jobId } }, 
            { new: true }
        );
        
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Job saved successfully!", savedJobs: user.savedJobs });
    } catch (err) {
        console.error("Save job error:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
export default router;