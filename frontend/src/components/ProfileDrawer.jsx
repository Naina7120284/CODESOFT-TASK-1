import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProfileDrawer.css';
import ProfileUpdateModal from './ProfileUpdateModal';

const ProfileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeField, setActiveField] = useState("");
  

  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || {};
  });


  useEffect(() => {
    if (isOpen) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUserData(savedUser);
    }
  }, [isOpen]);

  const handleTriggerUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        toast.error("File is too large! Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => toast.info("Processing image...");

      reader.onloadend = async () => {
        const base64String = reader.result;
        
        const updatedUser = { ...userData, profilePic: base64String };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        try {
           const response = await fetch(`${window.API_URL}/api/auth/update-profile-pic`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ profilePic: base64String })
          });

          if (response.ok) {
            toast.success("Photo synced to cloud!");
          }
        } catch (err) {
          console.error("Sync error:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    window.location.href = "/"; 
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <div className={`profile-side-drawer ${isOpen ? 'open' : ''}`}>
        <button className="close-drawer-btn" onClick={onClose}>&times;</button>

        <div className="drawer-header">
          <div className="profile-pic-wrapper">
            <img 
              src={userData?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt="User" 
            />
            <div className="edit-overlay" onClick={handleTriggerUpload}>
              <span>📷</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
              accept="image/*"
            />
          </div>
          
          <div className="user-details-section">
            <h3>{userData?.name || "User Name"}</h3>
         
            <div className="education-link" onClick={() => { setActiveField('education'); setIsModalOpen(true); }}>
               🎓 {userData?.education || "+ Add Education"}
            </div>

            <div className="mobile-link" onClick={() => { setActiveField('mobile'); setIsModalOpen(true); }}>
               📞 {userData?.mobile || "+ Add Mobile Number"}
            </div>
          </div>

          <button className="view-profile-btn" onClick={handleTriggerUpload}>
            Update Profile Photo
          </button>
        </div>

        {/* MODAL COMPONENT */}
    <ProfileUpdateModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      fieldType={activeField}
      userId={userData?._id || userData?.user?._id || userData?.data?._id} 
      onUpdateSuccess={(updatedUser) => {
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
   }}
  />
        <div className="drawer-nav-menu">
          <div className="link-item" onClick={() => handleNavigate('/career-guidance')}>
            <span className="icon">📋</span>
            <div className="text">Career guidance</div>
          </div>
          <div className="link-item" onClick={() => handleNavigate('/settings')}>
            <span className="icon">⚙️</span>
            <div className="text">Settings</div>
          </div>
          <div className="link-item logout" onClick={handleLogout}>
            <span className="icon">📤</span>
            <div className="text">Logout</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;