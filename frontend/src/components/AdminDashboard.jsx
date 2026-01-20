import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';
import './AdminDashboard.css';
import AdminSettings from './AdminSettings';
import AdminJobs from './AdminJobs';
import AdminApplications from './AdminApplications';
import AdminUsers from './AdminUsers';
import { 
  MdDashboard, MdWork, MdAssignment, 
  MdPeople, MdSettings, MdLogout,
  MdPerson, MdArrowBack
} from 'react-icons/md';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0, employers: 0, candidates: 0, totalJobs: 0, activeJobsCount: 0, totalApplications: 0
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState({ name: 'Admin', email: '' });

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/'); 
  };

  useEffect(() => {
      const fetchAdminProfile = async () => {
          try {
              const res = await fetch(`${window.API_URL}/api/admin/profile`);
              const data = await res.json();
              if (res.ok) setAdminData(data); 
          } catch (err) {
              console.error("Profile fetch failed:", err);
          }
      };
      fetchAdminProfile();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${window.API_URL}/api/admin/stats`);
        const data = await res.json();
        if (res.ok) {
          setStats(data); 
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
   
    <div className={`admin-container ${isMobileMenuOpen ? 'mobile-nav-active' : ''}`}>
      
      
      <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
         {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar Section */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'show' : ''}`}>
        <div className="sidebar-header-wrapper">
          <MdArrowBack className="back-icon" onClick={() => navigate('/')} />
          <div className="sidebar-brand">ADMIN DASHBOARD</div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
           
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
              <MdDashboard className="icon" /> Dashboard
            </li>
            <li className={activeTab === 'jobs' ? 'active' : ''} onClick={() => { setActiveTab('jobs'); setIsMobileMenuOpen(false); }}>
              <MdWork className="icon" /> Job Listings
            </li>
            <li className={activeTab === 'apps' ? 'active' : ''} onClick={() => { setActiveTab('apps'); setIsMobileMenuOpen(false); }}>
              <MdAssignment className="icon" /> Applications
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}>
              <MdPeople className="icon" /> Users
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>
              <MdSettings className="icon" /> Settings
            </li>
            <li className="logout-item" onClick={handleLogout}>
              <MdLogout className="icon" /> <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
          <header className="content-header">
  <div className="admin-profile-container">
    <div className="admin-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
      {/* CHANGE THIS: Use adminData.name instead of "Admin" */}
      <span>{adminData.name || "Loading..."}</span> 
      <MdPerson className="profile-icon" />
    </div>

    {isProfileOpen && (
      <div className="profile-dropdown-premium fade-in">
        <div className="dropdown-user-info">
          {/* Real data from backend */}
          <strong>{adminData.name}</strong>
          <p>{adminData.email}</p>
        </div>
        <hr />
        <button className="dropdown-btn logout" onClick={handleLogout}>
          <MdLogout /> Sign Out
        </button>
       </div>
      )}
   </div>
  </header>

        <div className="viewport-padding">
          {activeTab === 'dashboard' && (
            <div className="fade-in dashboard-viewport">
              <h1 className="view-title">Platform Intelligence</h1>
              
              <div className="stats-grid-premium">
                <div className="glass-card-stat">
                  <div className="stat-icon purple"><MdWork /></div>
                  <div className="stat-info">
                    <h3>{stats.totalJobs || 0}</h3>
                    <p>Jobs Listed</p>
                  </div>
                </div>
                <div className="glass-card-stat">
                  <div className="stat-icon blue"><MdAssignment /></div>
                  <div className="stat-info">
                    <h3>{stats.totalApplications || 0}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
                <div className="glass-card-stat">
                  <div className="stat-icon green"><MdPeople /></div>
                  <div className="stat-info">
                    <h3>{stats.employers || 0}</h3>
                    <p>Verified Employers</p>
                  </div>
                </div>
                <div className="glass-card-stat">
                  <div className="stat-icon orange"><MdPerson /></div>
                  <div className="stat-info">
                    <h3>{stats.candidates || 0}</h3>
                    <p>Total Candidates</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-main-grid">
                <div className="activity-container-pro list-card">
                  <div className="activity-header">
                    <h3>Top Active Employers</h3>
                    <button className="btn-text-only" onClick={() => setActiveTab('users')}>Manage</button>
                  </div>
                  <div className="activity-placeholder">
                     <p>Live tracking is active. Top employers will appear here.</p>
                   </div>
                </div>

                <div className="activity-container-pro list-card">
                  <div className="activity-header">
                    <h3>Recent Job Applications</h3>
                    <button className="btn-text-only" onClick={() => setActiveTab('apps')}>View All</button>
                  </div>
                  <div className="activity-placeholder">
                    <p>No new applications in the last 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'jobs' && <AdminJobs />} 
          {activeTab === 'apps' && <AdminApplications />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'settings' && <AdminSettings setActiveTab={setActiveTab} />}
        </div>
      </main>
    </div>
  )}
  export default AdminDashboard;