import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));

  // --- PASSWORD UPDATE STATE ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // --- CUSTOM MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const openConfirmModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };


  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
   
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return toast.error("New password must be at least 6 characters and include a letter and a number.");
    }

    setIsUpdating(true);
    try {
       const res = await fetch(`${window.API_URL}/api/users/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData._id,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Security Verified! Check your email for confirmation.");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFinalAction = () => {
    setShowModal(false);
    if (modalType === 'delete') {
      toast.error("Account permanently deleted.");
    } else {
      toast.info("Account deactivated successfully.");
    }
    
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/auth";
    }, 2000);
  };

  return (
    <div className="aesthetic-settings-wrapper">
      {/* --- PREMIUM GLASS MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-modal">
            <div className="modal-icon">{modalType === 'delete' ? '🗑️' : '🌙'}</div>
            <h2>Confirm Action</h2>
            <p>
              {modalType === 'delete' 
                ? "WARNING: This will permanently remove all your professional data. This action cannot be undone!" 
                : "Are you sure you want to deactivate? You can reactivate anytime by simply logging back in."}
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className={modalType === 'delete' ? "modal-confirm-delete" : "modal-confirm-deactivate"}
                onClick={handleFinalAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-content">
        <button className="minimal-back" onClick={() => navigate(-1)}>
          <span>←</span> Back to Dashboard
        </button>

        <header className="settings-intro">
          <h1>Account <span>Preferences</span></h1>
          <p>Managed account for <strong>{userData?.email}</strong></p>
        </header>

        <div className="aesthetic-grid">
          {/* SECURITY SECTION */}
          <div className="pearl-card">
            <div className="card-icon-header">
              <span className="icon-bg">🛡️</span>
              <h3>Security</h3>
            </div>
            <form className="pearl-form" onSubmit={handleUpdatePassword}>
              <div className="pearl-input-row">
                <label>Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="contrast-input" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="pearl-input-row">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="Letters & numbers (min 6)" 
                  className="contrast-input" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="pearl-action-btn" disabled={isUpdating}>
                {isUpdating ? "Processing..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* SECTION 2: DISCOVERY */}
          <div className="pearl-card">
            <div className="card-icon-header">
              <span className="icon-bg">👁️</span>
              <h3>Discovery</h3>
            </div>
            <div className="pearl-toggle-list">
              <div className="pearl-toggle">
                <div className="toggle-info">
                  <strong>Recruiter Search</strong>
                  <span>Allow verified companies to find your profile</span>
                </div>
                <input type="checkbox" className="custom-checkbox" defaultChecked />
              </div>

              <div className="pearl-toggle">
                <div className="toggle-info">
                  <strong>Job Matches</strong>
                  <span>Get AI-powered job alerts via email</span>
                </div>
                <input type="checkbox" className="custom-checkbox" defaultChecked />
              </div>
            </div>
          </div>

          {/* DATA MANAGEMENT SECTION */}
          <div className="pearl-card danger-pearl">
            <div className="card-icon-header">
              <span className="icon-bg">⚠️</span>
              <h3>Data Management</h3>
            </div>
            <p className="danger-text">Archive or permanently remove your professional data from JobBoard.</p>
            <div className="danger-actions">
               <button className="deactivate-btn" onClick={() => openConfirmModal('deactivate')}>Deactivate</button>
               <button className="delete-permanent-btn" onClick={() => openConfirmModal('delete')}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;