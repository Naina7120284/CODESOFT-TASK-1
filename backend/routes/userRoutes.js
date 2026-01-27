import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multerCloudinary = require('multer-storage-cloudinary');
import { 
    updateProfile, 
    verifyOtpAndUpdate, 
    uploadProfilePic,
    updatePassword,
    loginUser,
    registerUser,
    unsaveJob,
    updateProfileFull, 
} from '../controllers/userController.js';
import User from '../models/User.js'; 

const router = express.Router();

const CloudinaryStorage = multerCloudinary.CloudinaryStorage || multerCloudinary;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const storage = new CloudinaryStorage({
 cloudinary: { v2: cloudinary }, 
  params: { 
    folder: 'job-board-avatars',
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});
const upload = multer({ storage: storage });

router.post('/register', registerUser);
router.post('/login', loginUser);-
router.post('/update-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const { userId } = req.body; 
    const imageUrl = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { profilePic: imageUrl }, 
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, url: imageUrl, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed on server" });
  }
});

router.post('/update-profile-full', upload.single('resume'), updateProfileFull);
router.put('/update-profile/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: false }
        );
        if (!updatedUser) return res.status(404).json("User not found");
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/update-profile', updateProfile);
router.post('/verify-otp', verifyOtpAndUpdate);
router.put('/update-password', updatePassword); 
router.post('/save-job', async (req, res) => {
    const { userId, jobId } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedJobs: jobId } }, 
            { new: true, runValidators: false } 
        );
        
        if (!updatedUser) return res.status(404).json("User not found");
        res.status(200).json("Job saved!");
    } catch (err) { res.status(500).json(err); }
});
router.get('/saved-jobs/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('savedJobs');
        if (!user) return res.status(404).json("User not found");
        res.status(200).json(user.savedJobs);
    } catch (err) { res.status(500).json(err); }
});
router.post('/unsave-job', unsaveJob);
export default router;