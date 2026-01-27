import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Landing from './pages/Landing';
import Auth from "./pages/Auth"; 
import Hero from "./components/Hero";
import Home from './pages/Home';
import RegisterProfile from './pages/RegisterProfile'; 
import Settings from './pages/Settings';
import CareerGuidance from './pages/CareerGuidance';
import JobDetails from './pages/JobDetails';
import AdminDashboard from './components/AdminDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import JobListing from './pages/JobListing';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, adminOnly = false , employerOnly = false, candidateOnly = false}) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/auth" />;

  if (adminOnly && user.role !== 'admin') {
    toast.error("Access Denied: Admins only!");
    return <Navigate to="/Hero" />;
  }

  if (employerOnly && user.role !== 'employer') {
    toast.error("Access Denied: Employers only!");
    return <Navigate to="/Hero" />;
  }

  if (candidateOnly && user.role !== 'candidate') {
    toast.warning("Switching to Employer Panel...");
    return <Navigate to="/employer-dashboard" />; 
  }

  return children;
};

const NavbarWrapper = ({ user }) => {
  const location = useLocation();
  const employerPaths = ['/employer-dashboard', '/post-job'];
  
  if (user && employerPaths.includes(location.pathname)) {
    return <Navbar />;
  }
  return null;
};

function App() {
   const userString = localStorage.getItem('user');
   const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);
  return (
    <Router>
      <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
     <NavbarWrapper user={user} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/complete-profile" element={<RegisterProfile />} />

        <Route path="/Hero" element={<ProtectedRoute><Hero /></ProtectedRoute>} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly={true}>
             <AdminDashboard />
          </ProtectedRoute>
         } 
      />

        <Route path="/candidate-dashboard" element={
          <ProtectedRoute adminOnly={false} candidateOnly={true}>
             <CandidateDashboard />
          </ProtectedRoute>
        }/>

        <Route 
          path="/employer-dashboard" 
          element={
            <ProtectedRoute employerOnly={true}>
              <EmployerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/post-job" 
          element={ 
            <ProtectedRoute employerOnly={true}>
              <PostJob />
            </ProtectedRoute>
          } 
        />
        <Route path="/jobs" element={<ProtectedRoute><JobListing /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/career-guidance" element={<ProtectedRoute><CareerGuidance /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;