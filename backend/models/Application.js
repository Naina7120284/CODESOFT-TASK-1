import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    // IDs for linking
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Candidate Details from the Form
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    resume: { type: String },
    
    // Job Context
    jobTitle: String,
    company: String,
    
    // Status & Tracking
    status: { type: String, default: 'Pending' }, 
    appliedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Application', applicationSchema);