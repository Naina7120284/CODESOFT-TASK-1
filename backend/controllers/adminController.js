// backend/controllers/adminController.js
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Settings from '../models/Settings.js';

// FUNCTION 1: For the Dashboard Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const employers = await User.countDocuments({ role: 'employer' });
    const candidates = await User.countDocuments({ role: 'candidate' });
    const activeJobsCount = await Job.countDocuments({ status: 'Active' });
    const expiredJobsCount = await Job.countDocuments({ status: 'Expired' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    res.status(200).json({
      totalUsers,
      employers,
      candidates,
      totalJobs,
      activeJobsCount, 
      expiredJobsCount,
      totalApplications,
      pendingJobs: 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching real-time stats" });
  }
};

export const getAdminApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      // Use 'jobId' and 'userId' to match your application.js file
      .populate('jobId', 'title company') 
      .populate('userId', 'name email')
      .sort({ appliedAt: -1 }); // Matches your schema's timestamp field

    res.status(200).json(applications);
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetches all users and sorts by newest first
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// FUNCTION 2: For the Job Listings Table
export const getAllJobs = async (req, res) => {
  try {
    // This finds all 5 jobs from your database
    const jobs = await Job.find().sort({ createdAt: -1 }); 
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job list" });
  }
};

export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Job.findByIdAndUpdate(id, { status });
        res.status(200).json({ message: "Status updated" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        await Job.findByIdAndDelete(id); // Removes the job from your Atlas database
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
    }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 2. Create the new user record
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // 3. Send back the new user data to the frontend
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Create default if empty
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true // Creates it if it doesn't exist
    });
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: "Error saving settings" });
  }
};

export const getAdminProfile = async (req, res) => {
    try {
        // Find the admin in your User model
        const admin = await User.findOne({ role: 'admin' }); 
        
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            name: admin.name, // Sends "Naina Shukla" or "Devananda AS"
            email: admin.email
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};