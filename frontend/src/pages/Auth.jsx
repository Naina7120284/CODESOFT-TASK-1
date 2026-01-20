import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { toast } from 'react-toastify';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'candidate' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    
    try {
        const res = await fetch(`${window.API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json(); 

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          toast.success(`Welcome back, ${data.user.name}!`);

          const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
          sessionStorage.removeItem('redirectAfterLogin'); 

          setTimeout(() => {
            if (savedRedirect) {
              navigate(savedRedirect); 
            } 

            else if (data.user.role === 'admin') {
            navigate("/admin/dashboard"); 
           }
           
            else if (data.user.role === 'employer') {
              navigate("/employer-dashboard");
            } 
            else {
              navigate("/Hero"); 
            }
          }, 800);
        } else {
          toast.success("Registration successful! Please login.");
          setIsLogin(true); 
        }
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      toast.error("Server connection error! Check if backend is running.");
    }
  };

  return (
    <div className="auth-master-wrapper">
      <div className="auth-glass-card">
        <button className="auth-back-btn" onClick={() => navigate('/')}> ← </button>
        <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        
        <form className="auth-form-layout" onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Email ID</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          <div className="input-box">
            <label>Password</label>
            <div className="pass-wrap">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>

      
        <p className="auth-switch" style={{ marginTop: '20px', textAlign: 'center' }}>
            New to JobBoard? 
     <span 
       onClick={() => {
         setIsLogin(false); 
         window.location.href = '/complete-profile'; 
      }} 
      style={{ cursor: 'pointer', color: '#a855f7', fontWeight: 'bold' }}
   >
    Sign Up
  </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;