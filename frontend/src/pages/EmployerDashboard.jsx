import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import Swal from 'sweetalert2';
import './EmployerDashboard.css';
import { FaArrowLeft, FaChartLine, FaPlusSquare, FaUsers, FaBuilding, FaDownload, FaCheck, FaTimes } from 'react-icons/fa'; 
import Navbar from '../components/Navbar'; 
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false);

  const [companyData, setCompanyData] = useState({
    companyName: '',
    website: '',
    description: '',
    location: '',
    contactEmail: ''
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const API_BASE = import.meta.env.VITE_API_URL;
        if (!user) { navigate('/auth'); return; }


        const jobRes = await fetch(`${API_BASE}/api/jobs/all`);;
        if (jobRes.ok) {
          const allJobs = await jobRes.json();
          const filteredJobs = allJobs.filter(job => 
            job.employerId === user._id || 
            job.postedBy === user._id || 
            job.company?.toLowerCase() === user.name?.toLowerCase()
          );
          setMyJobs(filteredJobs);
        }

        const appRes = await fetch(`${API_BASE}/api/applications/employer/${user._id}`);
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplicants(appData); 
        } else {
          console.error("Failed to fetch applicants:", appRes.status);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

 
  useEffect(() => {
    if (activeTab === 'Company Profile') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setCompanyData({
          companyName: user.name || '',
          website: user.website || '',
          description: user.description || '',
          location: user.location || '',
          contactEmail: user.email || ''
        });
      }
    }
  }, [activeTab]);


 const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const API_BASE = import.meta.env.VITE_API_URL;

       
        const res = await fetch(`${API_BASE}/api/users/update-profile/${user._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        });

        if (res.ok) {
            toast.success("Profile Updated Successfully!");
            localStorage.setItem('user', JSON.stringify({ ...user, ...companyData }));
        } else {
            toast.error("Failed to update profile.");
        }
    } catch (err) {
        console.error("Profile update error:", err);
        toast.error("Network error.");
    }
};


  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this job posting!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed', 
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: 'rgba(255, 255, 255, 0.95)', 
      backdrop: `rgba(15, 23, 42, 0.4) blur(8px)` 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${window.API_URL}/api/jobs/${id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your job has been removed.',
              icon: 'success',
              confirmButtonColor: '#7c3aed'
            });
            setMyJobs(myJobs.filter(job => job._id !== id));
          }
        } catch (err) {
          Swal.fire('Error', 'Could not connect to server', 'error');
        }
      }
    });
  };
  const handleLogout = () => {
   
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success("Logged out successfully");

    navigate('/auth');
  };

  const updateStatus = async (appId, newStatus) => {
  try {
   const res = await fetch(`${window.API_URL}/api/applications/status/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      toast.success(`Status updated to ${newStatus}`);
    }
  } catch (err) {
    console.error(err);
  }
};

     return (
      <div className="employer-dashboard-master">
    <div className="dashboard-master-wrapper">
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon style={{ color: '#7c3aed', fontSize: '28px' }} /> 
      </button>

    <div className="dashboard-container">
      <aside className={`sidebar employer-sidebar ${isOpen ? 'active' : ''}`}>
          <button className="close-sidebar" onClick={() => setIsOpen(false)}>
             <CloseIcon />
          </button>

          <Link to="/" className="back-arrow-link">
            <FaArrowLeft /> Back to Home
          </Link>
          <h2>HireHub</h2>
          <ul>
            <li className={activeTab === 'Dashboard' ? 'active' : ''} 
                onClick={() => {setActiveTab('Dashboard'); setIsOpen(false);}}>
              <FaChartLine /> Dashboard
            </li>

            <li><Link to="/post-job" style={{color: 'inherit', textDecoration: 'none'}}><FaPlusSquare /> Post a New Job</Link></li>

            <li className={activeTab === 'Manage Applicants' ? 'active' : ''} 
            onClick={() => {setActiveTab('Manage Applicants');setIsOpen(false);}}>
              <FaUsers /> Manage Applicants</li>

            <li className={activeTab === 'Company Profile' ? 'active' : ''} onClick={() => {setActiveTab('Company Profile'); setIsOpen(false);}}>
              <FaBuilding /> Company Profile</li>
        </ul>
     </aside>

       <main className="dashboard-content">
        <div className="content-wrapper">
          <header className="dash-header">
          </header>

    
            {activeTab === 'Dashboard' && (
              <div className="active-jobs">
                <h2>Your Active Postings</h2>
                {loading ? <p>Loading...</p> : myJobs.length > 0 ? myJobs.map((job) => (
                  <div className="job-item" key={job._id}>
                    <div className="job-info">
                      <strong>{job.title}</strong>
                      <p>{job.location} • {job.salary}</p>
                    </div>
                    <div className="job-actions">
                      <button className="view-btn" onClick={() => setActiveTab('Manage Applicants')}>View Applicants</button><br />
                      <button className="delete-btn-dash" onClick={() => handleDelete(job._id)}>Delete</button>
                    </div>
                  </div>
                )) : <p>No active postings found.</p>}
              </div>
            )}

  {activeTab === 'Manage Applicants' && (
  <div className="applicants-section glass-panel">
    <h2>Recent Applications</h2>
    <div className="table-container">
      <table className="applicants-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job Role</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length > 0 ? applicants.map((app) => (
            <tr key={app._id} className="aesthetic-row">
              <td className="candidate-name">
             <strong>
                {app.firstName ? `${app.firstName} ${app.lastName || ''}` : (app.userName || app.name || "Real Name Missing")}
             </strong>
         </td>
              <td className="job-title-cell">
                {app.jobTitle || app.role || "Job Seeker"}
              </td>
              <td>
               <button className={`status-pill ${app.status?.toLowerCase().replace(/\s+/g, '-') || 'under-review'}`}>
               {app.status || "Under Review"}
               </button>
              </td>
            <td className="resume-cell">
              {app.resume ? (
               <a 
                 href={`${window.API_URL}${app.resume}`}
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="view-resume-link"
               >
                 📄 View Resume
            </a>
         ) : (
          <span className="no-resume">No Resume Provided</span>
       )}
  </td>
              <td className="action-cell">
                <button className="btn-approve-glass" onClick={() => updateStatus(app._id, 'Shortlisted')}>
                  <FaCheck /><br />
                </button>
                <button className="btn-reject-glass" onClick={() => updateStatus(app._id, 'Rejected')}>
                  <FaTimes />
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>No applicants found yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
         
            {activeTab === 'Company Profile' && (
              <div className="profile-section">
                <h2>Company Details</h2>
                <form className="profile-edit-form" onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" value={companyData.companyName} onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Company Website</label>
                    <input type="url" placeholder="https://company.com" value={companyData.website} onChange={(e) => setCompanyData({...companyData, website: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows="4" value={companyData.description} onChange={(e) => setCompanyData({...companyData, description: e.target.value})}></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Location</label><input type="text" value={companyData.location} onChange={(e) => setCompanyData({...companyData, location: e.target.value})} /></div>
                    <div className="form-group"><label>Contact Email</label><input type="email" value={companyData.contactEmail} onChange={(e) => setCompanyData({...companyData, contactEmail: e.target.value})} /></div>
                  </div>
                  <button type="submit" className="save-profile-btn">Save Changes</button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default EmployerDashboard;