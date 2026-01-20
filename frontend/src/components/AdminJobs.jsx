import React, { useState, useEffect } from 'react';
import { MdMoreHoriz, MdWork, MdSearch } from 'react-icons/md';
import Swal from 'sweetalert2';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);

   const [jobStats, setJobStats] = useState({ total: 0, active: 0, expired: 0 }); 

   useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${window.API_URL}/api/admin/stats`);
                const data = await res.json();
                if (res.ok) {
                    setJobStats({ 
                        total: data.totalJobs, 
                        active: data.activeJobsCount, 
                        expired: data.expiredJobsCount 
                    });
                }
            } catch (err) { console.error("Stats fetch failed:", err); }
        };
        fetchStats();
    }, [jobs]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                
                const res = await fetch(`${window.API_URL}/api/admin/jobs`);
                const data = await res.json();
                if (res.ok) setJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        };
        fetchJobs();
    }, []);

   
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Expired' : 'Active';
        try {
            const res = await fetch(`${window.API_URL}/api/admin/jobs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
           if (res.ok) {
            const updatedJobs = jobs.map(job => 
                job._id === id ? { ...job, status: newStatus } : job
            );
            setJobs(updatedJobs);
        }
    } catch (err) {
        console.error("Failed to update status:", err);
    }
};
   
  const handleDeleteJob = async (jobId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "This job listing will be permanently deleted from the platform!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7c3aed', 
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete job!',
    background: '#ffffff',
    borderRadius: '16px',
    customClass: {
      popup: 'premium-swal-popup'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${window.API_URL}/api/admin/jobs/${jobId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          
          setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
          
          Swal.fire({
            title: 'Deleted!',
            text: 'The job posting has been removed.',
            icon: 'success',
            confirmButtonColor: '#7c3aed',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to connect to the server.', 'error');
      }
    }
  });
};
    return (
        <div className="fade-in">
            <h1 className="view-title">Job Listings Management</h1>

            <div className="mini-stats-container">
                <div className="mini-stat-box all">
                    <div className="mini-icon"><MdWork /></div>
                    <div className="mini-data">
                        <span>All Jobs</span>
                        <strong>{jobStats.total}</strong>
                    </div>
                </div>
                <div className="mini-stat-box active">
                    <div className="mini-icon">●</div>
                    <div className="mini-data">
                        <span>Active</span>
                        <strong>{jobStats.active}</strong>
                    </div>
                </div>
                <div className="mini-stat-box expired">
                    <div className="mini-icon">●</div>
                    <div className="mini-data">
                        <span>Expired</span>
                        <strong>{jobStats.expired}</strong>
                    </div>
                </div>
            </div>

            {/* --- SEARCH & FILTER BAR --- */}
            <div className="table-controls">
                <div className="search-box-premium">
                    <MdSearch />
                    <input type="text" placeholder="Search job titles..." />
                </div>
            </div>

            {/* --- PREMIUM DATA TABLE --- */}
            <div className="table-container-premium">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Job Position</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Salary Range</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job._id}>
                                <td className="job-cell">
                                    <div className="job-icon-circle"><MdWork /></div>
                                    <div className="job-name-info">
                                        <strong>{job.title}</strong>
                                        <span className="job-type-tag">{job.jobType}</span>
                                    </div>
                                </td>
                                <td className="company-name-highlight">{job.company}</td>
                                <td className="location-text">{job.location}</td>
                                <td className="salary-text">{job.salary}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => toggleStatus(job._id, job.status || 'Active')}
                                        className={`status-btn-premium ${job.status === 'Expired' ? 'expired' : 'active'}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {job.status || 'Active'}
                                        <span className="status-dot"></span>
                                    </button>
                                </td>
                                <td>
                                    <button 
                                     className="delete-btn-premium" 
                                     onClick={() => handleDeleteJob(job._id)} 
                                  >
                                     Delete
                                    </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminJobs;