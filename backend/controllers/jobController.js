import Job from '../models/Job.js';
import User from '../models/User.js'; 

export const postJob = async (req, res) => {
  try {
    const { title, company, location, salary, description, requirements, jobType, employerId, postedBy, companyLogo } = req.body;
    const newJob = new Job({
      title, company, location, salary, description, requirements, jobType, companyLogo, 
      employerId: employerId || postedBy 
    });
    await newJob.save();
    res.status(201).json({ message: "Job created successfully!", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. GET ALL JOBS (Preserved)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }); 
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// 3. GET SINGLE JOB BY ID (Preserved)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE JOB BY ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};

// 4. SEARCH JOBS (Preserved)
export const searchJobs = async (req, res) => {
  try {
    const { title, location } = req.query;
    let query = {};
    if (title) query.title = { $regex: title, $options: 'i' }; 
    if (location) query.location = { $regex: location, $options: 'i' };
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error searching jobs", error: error.message });
  }
};

// 5. UNSAVE JOB (Now with safe User import)
export const unsaveJob = async (req, res) => {
    const { userId, jobId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();

        res.status(200).json({ message: "Job removed from saved list" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};