import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { getAdminStats, getAllJobs, updateJobStatus, deleteJob, getAdminApplications, getAllUsers, deleteUser, createUser, getSettings, updateSettings, getAdminProfile } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/jobs', getAllJobs);
router.patch('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getAdminApplications);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.post('/users/add', createUser);
router.get('/settings', getSettings);
router.put('/settings/update', updateSettings);
router.get('/profile', getAdminProfile);

router.put('/jobs/approve/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    res.json({ message: "Job Approved successfully!", job });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

router.delete('/jobs/reject/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job Rejected and Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
})

router.put('/users/toggle-status/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    user.status = newStatus;
    await user.save();
    res.json({ message: `User is now ${newStatus}`, status: newStatus });
  } catch (err) {
    res.status(500).json({ message: "Status toggle failed" });
  }
});

router.get('/profile', async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }); 
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json({
            name: admin.name, 
            email: admin.email
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;