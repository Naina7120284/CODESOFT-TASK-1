import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import { toast } from 'react-toastify';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${window.API_URL}/api/jobs/all`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Could not load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="job-listing-master">
      <Navbar />
      
      <div className="job-listing-container">
        <header className="listing-header">
          <h1>Explore <span className="highlight">Opportunities</span></h1>
          <p>Find the best tech roles tailored for your skills.</p>
        </header>

        {loading ? (
          <div className="loading-state">Searching for jobs...</div>
        ) : (
          <div className="jobs-grid">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div className="job-card-premium" key={job._id}>
                  <div className="job-card-header">
                    <span className="job-type-badge">{job.jobType || 'Full-time'}</span>
                    <h3>{job.title}</h3>
                    <p className="company-name">{job.company}</p>
                  </div>
                  
                  <div className="job-card-body">
                    <p>{job.location}</p>
                    <p>{job.salary}</p>
                    <p className="job-desc-short">
                      {job.description?.substring(0, 100)}...
                    </p>
                  </div>

                  <button className="apply-btn" onClick={() => toast.info("Application system coming soon!")}>
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No jobs found. Check back later!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;