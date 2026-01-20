import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RegisterProfile.css';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'; 

const RegisterProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: '',
    countryCode: '+91',
    mobile: '',
    workStatus: 'fresher',
    role: 'candidate' 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
       const res = await fetch(`${window.API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isProfileComplete: true }) 
      });

      const data = await res.json();

    if (res.ok) {
       localStorage.setItem('token', data.token); 
       localStorage.setItem('user', JSON.stringify(data.user)); 

       toast.success("🚀 Profile Complete! Welcome.");

   
       const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
       sessionStorage.removeItem('redirectAfterLogin');

       setTimeout(() => {
        
            if (savedRedirect) {
                navigate(savedRedirect);
            } 
           
            else if (data.user.role === 'employer') {
                navigate("/employer-dashboard");
            } 
            else {
                navigate("/Hero");
            }
        }, 1500);

        } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Server connection error.");
    }
  };

  return (
    <div className="naukri-registration-layout">
      <header className="registration-header-glass">
        <div className="header-container">
          <Link to="/" className="reg-logo">JOB<span>BOARD</span></Link>
          <div className="header-right-text">
            Already Registered? <Link to="/auth" className="login-accent">Login here</Link>
          </div>
        </div>
      </header>

      <div className="registration-back-container">
        <div 
          className="minimal-back-arrow" 
          onClick={() => navigate('/')} 
          title="Back to Landing"
        >
          <FaArrowLeft />
        </div>
      </div>

      <div className="registration-card">
        <div className="card-header">
          <h2 className="main-title">Create your profile</h2>
          <p className="subtitle">Search & apply to jobs from India's No.1 Job Site</p>
        </div>
        
        <form className="cute-form" onSubmit={handleRegister}>
          
          <div className="form-item">
            <label>I am a*</label>
            <select 
              className="role-select-premium" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            >
              <option value="candidate">Candidate (Looking for Jobs)</option>
              <option value="employer">Employer (Hiring People)</option>
            </select>
          </div>

          <div className="form-item">
            <label>Full name*</label>
            <input 
              type="text" 
              placeholder="What is your name?" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className="form-item">
            <label>Email ID*</label>
            <input 
              type="email" 
              placeholder="Tell us your Email ID" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="form-item">
            <label>Password*</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="(Minimum 6 characters)" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
              <button 
                type="button" 
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-item">
            <label>Mobile number*</label>
            <div className="mobile-input-wrapper">
              <div className="country-box">
                <span>{formData.countryCode}</span>
              </div>
              <input 
                type="tel" 
                placeholder="Enter mobile number" 
                className="mobile-field"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="form-item">
            <label>Work status*</label>
            <div className="status-selection">
              <div 
                className={`status-pill ${formData.workStatus === 'experienced' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, workStatus: 'experienced'})}
              >
                <strong>Experienced</strong>
                <span>Work experience</span>
              </div>
              <div 
                className={`status-pill ${formData.workStatus === 'fresher' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, workStatus: 'fresher'})}
              >
                <strong>Fresher</strong>
                <span>Student/Fresher</span>
              </div>
            </div>
          </div>

          <button type="submit" className="naukri-submit-btn">Register now</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterProfile;