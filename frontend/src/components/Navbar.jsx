import React, { useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  

  useEffect(() => {
 
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [location]);


  const handleLogout = () => {
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
    setUser(null);
    toast.success("Logged out successfully!");
    navigate('/'); 
  };

const isDashboard = location.pathname.includes('dashboard') || location.pathname.includes('admin');
const isEmployerDashboard = location.pathname === '/employer-dashboard' || location.pathname === '/post-job';

return (!isDashboard || isEmployerDashboard) ? (
  <nav className="main-nav-glass">
    <div className="nav-links-container">
      
      <Link to="/Hero" className="nav-item">Home</Link>

      {user?.role === 'admin' && (
        <Link to="/admin/dashboard" className="nav-item admin-highlight">Admin Panel</Link>
      )}

      {user?.role === 'employer' && (
        <Link to="/employer-dashboard" className="nav-item">Employer Panel</Link>
      )}
      
      {user?.role === 'candidate' && (
        <Link to="/candidate-dashboard" className="nav-item">My Jobs</Link>
      )}
      
      {user ? (
        <>
          <Link to="/settings" className="nav-item">Settings</Link>
          <button onClick={handleLogout} className="logout-button-red">
            Logout
          </button>
        </>
      ) : (
        <Link to="/auth" className="nav-item">Login</Link>
      )}
    </div>
  </nav>
) : null;
};

export default Navbar;