import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { toast } from "react-toastify"; 
import "./Landing.css";

const Landing = () => {
  const [jobs, setJobs] = useState([]); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

 
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${window.API_URL}/api/jobs/all`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Jobs loaded successfully:", data); 
        setJobs(data.slice(0, 3)); 
      } else {
        console.error("Server error:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  fetchJobs();
}, []);

  const handleNavClick = (path) => {
  const user = localStorage.getItem('user');
  if (!user) {
    
    sessionStorage.setItem('redirectAfterLogin', path);
    
   
    if (path.includes('employer')) {
      sessionStorage.setItem('intendedRole', 'employer');
    } else if (path.includes('candidate')) {
      sessionStorage.setItem('intendedRole', 'candidate');
    }
    
    toast.info("Please login to access this page");
    navigate('/auth');
  } else {
    navigate(path);
  }
};

const handleExploreMore = () => {
  const user = localStorage.getItem('user');
  if (!user) {
  
    sessionStorage.setItem('redirectAfterLogin', '/Hero'); 
    toast.info("Welcome! Please login to explore all features.");
    navigate('/auth');
  } else {
    navigate('/Hero');
  }
};

const handleViewDetails = (jobId) => {
  const user = localStorage.getItem('user');
  if (!user) {
    // Save the intended path so they go there after logging in
    sessionStorage.setItem('redirectAfterLogin', `/job/${jobId}`);
    toast.info("Please login to see full job details");
    navigate('/auth');
  } else {
    navigate(`/job/${jobId}`);
  }
};

  return (
    <div className="landing-page-wrapper">
      <nav className="landing-nav">
        <img src="/logo.png" alt="JOBBOARD Logo" className="nav-logo-img" />

      <button className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
       onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? '✕' : '☰'}
      </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <span onClick={() => handleNavClick('/Hero')} className="btn-nav" style={{cursor:'pointer'}}>Home</span>
          
          <a href="#jobs" className="btn-nav" onClick={() => setIsMenuOpen(false)}>Jobs</a>
        
          <span onClick={() => handleNavClick('/candidate-dashboard')} className="btn-nav" style={{cursor:'pointer'}}>Candidates</span>
          <span onClick={() => handleNavClick('/employer-dashboard')} className="btn-nav" style={{cursor:'pointer'}}>Employers</span>
          
          <a href="#about" className="btn-nav" onClick={() => setIsMenuOpen(false)}>About</a>
        </div>

        <div className="nav-auth">
          <Link to="/auth" className="btn-auth">Login</Link>
        </div>
      </nav>

    
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock Your Future<br />
            <span className="highlight-text">Code Your Career</span>
          </h1>
          <p className="hero-subtitle">
            Connect with top tech companies. Join the #1 platform for developers.
          </p>
        
          <button onClick={() => handleNavClick('/Hero')} className="main-cta-btn">Get Started</button>
        </div>
      </header>

    
      <section className="jobs-section" id="jobs">
        <div className="section-container">
          <h2 className="section-title">Top <span className="highlight-text">Job Openings</span></h2>
          <p className="section-subtitle">Explore real opportunities from our verified employers.</p>
          
          <div className="jobs-grid">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div className="job-card" key={job._id}>
                  <span className="job-badge">{job.jobType || 'Remote'}</span>
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <div className="details">
                    <span>{job.location}</span> • <span>{job.salary}</span>
                  </div>
                  <button onClick={() => handleViewDetails(job._id)} className="view-btn">
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <p style={{color:'white'}}>No jobs posted yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </section>

 
      <section className="about-modern-section" id="about">
        <div className="about-content-wrapper">
          <div className="about-header">
            <span className="badge">OUR SERVICES</span>
            <h2 className="about-title">Smarter Way to Find Your <span className="purple-text">Next Job</span></h2>
            <p className="about-desc">Welcome to the future of tech recruitment. <br /> JobBoard connects developers with the right opportunities through smart matching.</p>
            <button className="explore-btn" onClick={handleExploreMore}>
               Explore More
            </button>
          </div>

          <div className="about-grid">
            <div className="about-glass-card"><h3>Personalized Match</h3><p>Matches jobs based on your unique developer profile.</p></div>
            <div className="about-glass-card"><h3>Smart Search</h3><p>Advanced filtering by tech stack and location.</p></div>
            <div className="about-glass-card"><h3>Live Tracking</h3><p>Track your application from "Applied" to "Hired".</p></div>
            <div className="about-glass-card"><h3>Skill Analysis</h3><p>Understand the exact skills companies are looking for.</p></div>
            <div className="about-glass-card"><h3>Resume Builder</h3><p>Create a professional, ATS-friendly resume in minutes.</p> </div>
            <div className="about-glass-card"><h3>Expert Support</h3><p>Our team is available 24/7 to help you with your career journey.</p></div>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
  <div className="footer-container">

    <div className="footer-brand-section">
      <h2 className="footer-logo">JOB<span>BOARD</span></h2>
      <p className="footer-tagline">Empowering careers through world-class opportunities and professional growth.</p>
    </div>

    
    <div className="footer-links-grid">
      <div className="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><span className="footer-link" onClick={() => handleNavClick('/jobs')}>Browse Jobs</span></li>
          <li><span className="footer-link" onClick={() => handleNavClick('/Hero')}>Categories</span></li>
          <li><span className="footer-link" onClick={() => handleNavClick('/Hero')}>Companies</span></li>
        </ul>
      </div>
      
      <div className="footer-col">
        <h4>Support</h4>
        <ul>
          <li><span className="footer-link" onClick={() => handleNavClick('/Hero')}>Help Center</span></li>
          <li><span className="footer-link" onClick={() => handleNavClick('/Hero')}>Privacy Policy</span></li>
      <li><span className="footer-link" onClick={() => handleNavClick('/Hero')}>Terms of Service</span></li>
        </ul>
      </div>
    </div>
  </div>

  <div className="footer-bottom-bar">
    <div className="footer-copyright">
      © 2026 JOBBOARD. Crafted for Developers.
    </div>
    
    {/* Professional Social Links with Spacing & Logos */}
    <div className="footer-socials">
      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link linkedin">
        <FaLinkedin />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link twitter">
        <FaTwitter />
      </a>
      <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link github">
        <FaGithub />
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Landing;