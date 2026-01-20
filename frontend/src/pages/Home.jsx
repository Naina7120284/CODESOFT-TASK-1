import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Hero from '../components/Hero'; 
import './Home.css';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${window.API_URL}/api/jobs/all`);
        const data = await res.json();
        setFeaturedJobs(data.slice(0, 6)); 
        console.log("Successfully fetched jobs:", data);
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="home-container">
      <Hero /> 

   
      <section className="featured-section">
        <h2 className="section-title">Top Job Openings</h2>
        <div className="jobs-grid">
          {featuredJobs.map((job) => (
            <div key={job._id} className="featured-card">
              <div className="card-header">
                 <div className="mini-logo">
                    {job.company?.substring(0, 2).toUpperCase()}
                 </div>
                 <span className="company-badge">{job.company}</span>
              </div>
              
              <h3>{job.title}</h3>
              <p className="job-meta">{job.location} • {job.jobType}</p>
              
              <div className="card-footer">
                <span className="salary">{job.salary}</span>
                
               
                <Link to={`/job/${job._id}`} className="btn-view">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;