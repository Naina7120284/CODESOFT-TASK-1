import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
  type: String, 
  required: true,
  validate: {
    validator: function(v) {

      return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(v);
    },
    message: "Password must be at least 6 characters long and include both letters and numbers."
  }
},
  role: { 
    type: String, 
    enum: ['candidate', 'employer','admin'], 
    default: 'candidate' 
  },

  status: { 
    type: String,
    enum: ['active', 'blocked'],
    default: 'active' },

  createdAt: { 
    type: Date, 
    default: Date.now },
  
  // --- MOBILE & VERIFICATION SECTION ---
  mobile: { 
    type: String,
    default: null,
    unique: false, 
    sparse: true  
  },
  countryCode: { 
    type: String, 
    default: '+91' 
  },
  isMobileVerified: { 
    type: Boolean, 
    default: false 
  },
  otpCode: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },

  // --- PROFILE DETAILS SECTION ---
  workStatus: { 
    type: String, 
    enum: ['fresher', 'experienced'], 
    default: 'fresher' 
  },
  education: { 
    type: String,
    default: "" 
  },
  profilePic: { 
    type: String, 
    default: "" 
  },
  resumeUrl: {   
    type: String, 
    default: "" 
},
  isProfileComplete: { 
    type: Boolean, 
    default: false 
  },

  // --- SAVED JOBS SECTION ---
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job' 
  }]
}, { timestamps: true });


export default mongoose.model('User', userSchema);