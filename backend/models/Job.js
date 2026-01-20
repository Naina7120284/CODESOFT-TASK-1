import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String }, 
  description: { type: String },
  requirements: { type: String, default: "" },
  jobType: { type: String, default: 'Full-time' },
  companyLogo: { type: String, default: "" }, 
  

  status: { 
    type: String, 
    enum: ['Active', 'Expired'], 
    default: 'Active'
  },

  employerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);
export default Job;