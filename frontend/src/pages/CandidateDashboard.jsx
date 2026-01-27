import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import './CandidateDashboard.css';
import { 
    FaArrowLeft, FaUser, FaBriefcase, FaBookmark, 
    FaCog, FaSignOutAlt, FaRocket, FaCalendarCheck 
} from 'react-icons/fa';
import SettingsView from '../pages/Settings.jsx';
import JobDetails from '../pages/JobDetails.jsx';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
const CandidateDashboard = () => {
  
    const [currentUser, setCurrentUser] = useState(null); 
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]); 
    const [activeTab, setActiveTab] = useState('My Profile'); 
    const [resumeFile, setResumeFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        headline: '',
        phone: '',
        location: '',
        bio: ''
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();
    const fetchApplications = async (userId) => {
        try {
            const res = await fetch(`${window.API_URL}/api/applications/user/${userId}`);
            const data = await res.json();
            if (res.ok) setApplications(data);
        } catch (err) { console.log("Apps error:", err); }
    };

    const fetchSavedJobs = async (userId) => {
        try {
            const res = await fetch(`${window.API_URL}/api/users/saved-jobs/${userId}`);
            const data = await res.json();
            if (res.ok) setSavedJobs(data);
        } catch (err) { console.log("Error fetching saved jobs:", err); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            toast.info(`Selected: ${file.name}`); 
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (!currentUser?._id) {
            toast.error("Session expired. Please login again.");
            return;
        }
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('userId', currentUser._id);
            data.append('name', formData.fullName); 
            data.append('headline', formData.headline);
            data.append('mobile', formData.phone);
            data.append('location', formData.location);
            data.append('bio', formData.bio);
            
            if (resumeFile) {
                data.append('resume', resumeFile);
            }

            const res = await fetch(`${window.API_URL}/api/users/update-profile-full`, {
                method: 'POST',
                body: data 
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedUser.user));
                setCurrentUser(updatedUser.user);
                toast.success("Profile & Resume updated successfully! ✨");
            }
    } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to connect to server.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnsaveJob = async (jobId) => {
        try {
            if (!currentUser || !currentUser._id) return;
             const res = await fetch(`${window.API_URL}/api/users/unsave-job`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, jobId: jobId })
            });
            if (res.ok) {
                setSavedJobs(prev => prev.filter(job => job._id !== jobId));
                toast.warn("Removed!");
            }
        } catch (err) { console.log(err); }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setCurrentUser(savedUser);
            setFormData({
                fullName: savedUser.name || '',
                headline: savedUser.headline || '',
                phone: savedUser.mobile || '',
                location: savedUser.location || '',
                bio: savedUser.bio || ''
            });
            fetchApplications(savedUser._id);
            fetchSavedJobs(savedUser._id); 
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    if (!currentUser) return <div className="loading-screen"><div className="spinner"></div></div>;

return (
    <div className="dashboard-grid">
        
    <button 
        className={`mobile-menu-toggle ${isOpen ? 'sidebar-open' : ''}`} 
        onClick={() => setIsOpen(true)}
    >
        <MenuIcon style={{ color: '#7c3aed', fontSize: '28px' }} /> 
   </button>
      
  <aside className={`glass sidebar ${isOpen ? 'active' : ''}`}>

    <button className="close-sidebar" onClick={() => setIsOpen(false)}>
      <CloseIcon style={{ fontSize: '20px' }} />
   </button>
    <Link to="/" className="nav-back"><FaArrowLeft /> <span>Back Home</span></Link>
    <div className="sidebar-logo">
        <RocketLaunchIcon /> <span>CandidatePro</span>
    </div> 
   <nav className="sidebar-nav">
        <div className={`nav-item ${activeTab === 'My Profile' ? 'active' : ''}`} 
             onClick={() => {setActiveTab('My Profile'); setIsOpen(false);}}>
             <FaUser /> My Profile
        </div>
        <div className={`nav-item ${activeTab === 'Applied Jobs' ? 'active' : ''}`} 
             onClick={() => {setActiveTab('Applied Jobs'); setIsOpen(false);}}>
             <FaBriefcase /> Applied Jobs
        </div>
         <div className={`nav-item ${activeTab === 'Saved Jobs' ? 'active' : ''}`} 
         onClick={() => {setActiveTab('Saved Jobs'); setIsOpen(false);}}>
             <FaBookmark /> Saved Jobs
        </div>
        <div className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} 
             onClick={() => {setActiveTab('Settings'); setIsOpen(false);}}>
             <FaCog /> Settings
        </div>
    </nav>

    <button className="nav-logout" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
</aside>

            <main className="dashboard-main">
                <header className="main-header">
                    <div className="header-text">
                        <h1>Hello, <span className="gradient-text">{currentUser.name.split(' ')[0]}</span></h1>
                        <p>Welcome to your professional hub.</p>
                    </div>
                    
                    <div className="header-user-badge glass-morph">
                        <div className="user-avatar">
                            {currentUser.profilePic ? <img src={currentUser.profilePic} alt="Profile" /> : <span className="avatar-initial">{currentUser.name?.charAt(0).toUpperCase()}</span>}
                        </div>
                        <div className="user-info-mini">
                            <span className="user-name-mini">{currentUser.name?.split(' ')[0]}</span>
                            <span className="user-role-tag">Candidate</span>
                        </div>
                    </div>
                </header>

                {/* --- SMART TAB SWITCHER --- */}
                {activeTab === 'My Profile' && (
                    <ProfileSection 
                        formData={formData} 
                        currentUser={currentUser}
                        handleInputChange={handleInputChange} 
                        resumeFile={resumeFile} 
                        handleFileChange={handleFileChange} 
                        handleSaveProfile={handleSaveProfile} 
                        isSaving={isSaving} 
                    />
                )}

                {activeTab === 'Applied Jobs' && (
                    <section className="content-section animate-fade-in">
                        <div className="stats-row">
                            <div className="stat-box glass-morph">
                                <div className="stat-icon-wrapper purple"><FaBriefcase /></div>
                                <div className="stat-data"><h3>{applications.length}</h3><p>Jobs Applied</p></div>
                            </div>
                            <div className="stat-box glass-morph">
                                <div className="stat-icon-wrapper blue"><FaCalendarCheck /></div>
                                <div className="stat-data"><h3>0</h3><p>Interviews</p></div>
                            </div>
                        </div>
                        <div className="tracking-card glass-morph">
                            <div className="card-top"><h3>Application Pipeline</h3><div className="badge-live">LIVE TRACKING</div></div>
                            <div className="app-list">
                                {applications.map((app) => (
                                    <div className="app-row" key={app._id}>
                                        <div className="app-meta">
                                            <span className="app-title">{app.jobTitle}
                                            </span><span className="app-company">{app.company}</span>
                            
                                        <span style={{ 
                                                    fontSize: '0.75rem', 
                                                    color: '#94a3b8', 
                                                    marginTop: '2px', 
                                                    display: 'block' 
                                          }}>
                                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ""}
                                          </span>
                                    </div>

                                   <div className={`status-pill-tech ${app.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {app.status || "Pending"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'Saved Jobs' && (
                    <section className="content-section animate-fade-in">
                        <div className="section-header-pro">
                            <h2>Saved Opportunities</h2>
                        </div>
                        <div className="saved-jobs-grid">
                            {savedJobs.map((job) => (
                                <div className="job-glass-card glass-morph" key={job._id}>
                                    <h3>{job.title}</h3>
                                    <p>{job.company}</p>
                                    <div className="job-card-footer">
                                        <button className="apply-now-btn" onClick={() => { setSelectedJob(job); setIsModalOpen(true); }}>Apply Now</button>
                                        <button className="remove-saved-btn active" onClick={() => handleUnsaveJob(job._id)}><FaBookmark /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {isModalOpen && (
                    <div className="job-details-modal-overlay">
                        <div className="job-details-modal-container">
                            <JobDetails isModal={true} modalJobId={selectedJob._id} onClose={() => setIsModalOpen(false)} />
                        </div>
                    </div>
                )}

                {activeTab === 'Settings' && <SettingsView user={currentUser} />}
            </main>
        </div>
    );
};

export default CandidateDashboard;

// --- MOVED OUTSIDE TO FIX INPUT FREEZE ISSUE ---
const ProfileSection = ({ formData, handleInputChange, resumeFile, handleFileChange, handleSaveProfile, isSaving, currentUser}) => (
    <section className="content-section animate-fade-in">
        <div className="clean-profile-card">
            <div className="profile-header">
                <h2>Personal Information</h2>
                <p>Update your details to stand out to employers.</p>
            </div>
            
            <div className="profile-form-grid">
                <div className="form-group">
                    <label>Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Full Name" className="clean-input" />
                </div>
                <div className="form-group">
                    <label>Professional Headline</label>
                    <input name="headline" value={formData.headline} onChange={handleInputChange} type="text" placeholder="Headline" className="clean-input" />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="+91" className="clean-input" />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="e.g. Mumbai, India" className="clean-input" />
                </div>
                <div className="form-group full-width">
                    <label>Professional Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about yourself..." className="clean-textarea"></textarea>
                </div>
            </div>

            <div className="resume-section-horizontal">
                <div className="resume-info">
                    <div className="resume-icon">📄</div>
                    <div className="resume-text">
                        <strong>{resumeFile ? resumeFile.name : "Resume / CV"}</strong>
                        <span>PDF, DOCX (Max 5MB)</span>
        {currentUser.resumeUrl && (
             <a 
                 href={currentUser.resumeUrl} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="view-resume-link"
                 style={{ 
                 color: '#7c3aed', 
                 fontSize: '0.9rem', 
                 fontWeight: '700', 
                 textDecoration: 'underline', 
                 display: 'block', 
                 marginTop: '10px' 
              }}
           >
             Open Resume (Verified PDF) →
          </a>
        )}

                  </div>
                </div>
                <input type="file" id="resume-upload" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                <label htmlFor="resume-upload" className="upload-new-btn">
                    {resumeFile ? "Change File" : "Upload New"}
                </label>
            </div>

            <div className="form-footer">
                <button className="main-save-btn" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    </section>
);