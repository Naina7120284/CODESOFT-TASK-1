import express from 'express'; 
import { 
  postJob, 
  getAllJobs, 
  getJobById, 
  searchJobs, 
  deleteJob,
  unsaveJob 
} from '../controllers/jobController.js';

const router = express.Router();


router.get('/', getAllJobs);
router.get('/all', getAllJobs);
router.get('/search', searchJobs);
router.get('/:id', getJobById);
router.post('/create', postJob);
router.delete('/:id', deleteJob); 

router.post('/unsave-job', unsaveJob); 

export default router;