import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostJob = () => {
  const navigate = useNavigate();
  

  const user = JSON.parse(localStorage.getItem('user'));

  const [jobData, setJobData] = useState({
    title: '', 
    company: user?.name || '', 
    location: '', 
    salary: '', 
    description: '', 
    requirements: '', 
    jobType: 'Remote',
    companyLogo: '' 
  });


  useEffect(() => {
    if (!user || user.role !== 'employer') {
      toast.error("Access denied. Only employers can post jobs.");
      navigate('/auth');
    }
  }, [user, navigate]);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
 
      const payload = { ...jobData, postedBy: user._id };

     const res = await fetch(`${window.API_URL}/api/jobs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Job Published Successfully!");
        navigate('/'); 
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to post job.");
      }
    } catch (err) {
      toast.error("Network error. Check if backend is running.");
    }
  };

  return (
    <div className="auth-master-wrapper" style={{ flexDirection: 'column' }}>

      <div className="auth-glass-card post-job-card" 
           style={{ 
             marginTop: '20px',
             maxHeight: '85vh', 
             overflowY: 'auto', 
             paddingBottom: '30px' 
           }}>
        
        <button className="auth-back-btn" onClick={() => navigate(-1)}>←</button>
        
        <h2 className="auth-title">Post a New <span style={{color: '#a855f7'}}>Job</span></h2>
        
        <form className="auth-form-layout" onSubmit={handlePost}>
          <div className="input-box">
            <label>Job Title</label>
            <input type="text" placeholder="e.g. Web Solutions Engineer" 
              onChange={(e) => setJobData({...jobData, title: e.target.value})} required />
          </div>

          <div className="input-box">
            <label>Company Name</label>
            <input type="text" placeholder="e.g. Google" value={jobData.company} 
              onChange={(e) => setJobData({...jobData, company: e.target.value})} 
              required
            />
          </div>

          <div className="input-box">
            <label>Company Logo URL</label>
            <input 
              type="text" 
              placeholder="e.g. logo.clearbit.com/google.com" 
              onChange={(e) => setJobData({...jobData, companyLogo: e.target.value.trim()})} 
              style={{ border: '1px solid rgba(168, 85, 247, 0.4)' }} 
            />
            <small style={{ color: '#94a3b8', fontSize: '11px', marginTop: '5px' }}>
              Tip: Leave empty to use auto-generated initials logo
            </small>
          </div>

          <div className="input-box">
            <label>Location</label>
            <input type="text" placeholder="e.g. Mountain View, CA" 
              onChange={(e) => setJobData({...jobData, location: e.target.value})} required />
          </div>

          <div className="input-box">
            <label>Salary Range</label>
            <input type="text" placeholder="e.g. ₹20 LPA to ₹35 LPA" 
              onChange={(e) => setJobData({...jobData, salary: e.target.value})} required />
          </div>

          <div className="input-box">
            <label>Description</label>
            <textarea 
              placeholder="Describe the company and the role overview..."
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
              required
              style={{ width: '100%', minHeight: '100px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', color: 'white', padding: '15px', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>


          <div className="input-box">
            <label>Requirements</label>
            <textarea 
              placeholder="List the skills, experience, and tools needed..."
              onChange={(e) => setJobData({...jobData, requirements: e.target.value})}
              required
              style={{ width: '100%', minHeight: '100px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', color: 'white', padding: '15px', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <button type="submit" className="login-submit-btn">Publish Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;