import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    updateApplicationStatus, 
    submitApplication, 
    getCandidateApplications 
} from '../controllers/applicationController.js';

// CRITICAL IMPORTS: Preserved for Employer and Save Job logic
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js'; // FIXED: Added to support /save-job logic

const router = express.Router();

// 2. CONFIGURE MULTER STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists in your backend root
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

/**
 * Door 1: For submitting the application
 * Used by JobDetails.jsx to send candidate data to Atlconst upload = multer({ storage: storage });as
 */
router.post('/submit', upload.single('resume'), submitApplication);

/**
 * Door 2: For C -Dashboard to see  list
 * Used by CandidateDashboard.jsx to show real status updates
 */
router.get('/user/:candidateId', getCandidateApplications);

/**
 * Door 3: For YOUR Dashboard (Employer View)
 * This fetches applications for jobs specifically created by you
 */
router.get('/employer/:employerId', async (req, res) => {
    try {
        const { employerId } = req.params;
        
        // 1. Find all jobs posted by YOU (the employer)
        const jobs = await Job.find({ employerId: employerId });
        const jobIds = jobs.map(job => job._id);

        // 2. Find all applications linked to those specific Job IDs
        const applications = await Application.find({ jobId: { $in: jobIds } });
        
        res.status(200).json(applications);
    } catch (err) {
        console.error("Application route error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
});

/**
 * Door 4: Update Application Status
 * Used by EmployerDashboard to Shortlist or Reject candidates
 */
router.put('/status/:appId', updateApplicationStatus);

/**
 * Door 5: Save Job Logic
 * Uses $addToSet to prevent duplicate bookmarks in Juli's profile
 */
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