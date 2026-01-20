import React, { useState } from 'react';
import './AdminSettings.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminSettings = ({ setActiveTab }) => { 
  const user = JSON.parse(localStorage.getItem('user'));
  
    const [isEditingSite, setIsEditingSite] = useState(false);
    const [isEditingJobs, setIsEditingJobs] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingSystem, setIsEditingSystem] = useState(false);

const [config, setConfig] = useState({
    siteName: 'JobBoard',
    logoUrl: 'https://logo.com/brand.png',
    defaultCurrency: 'INR (₹)',
    postDuration: '30 Days',
    fromEmail: user?.email || 'admin@jobboard.com',
    template: 'New Application Notification',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'IST (UTC +5:30)'
  });

  const handleSave = async (section) => {
    try {
    const res = await fetch(`${window.API_URL}/api/admin/settings/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config) 
    });

    if (res.ok) {
    toast.success(`${section} updated successfully!`);
    setIsEditingSite(false);
    setIsEditingJobs(false);
    setIsEditingEmail(false);
    setIsEditingSystem(false);
  }
  } catch (err) {
    toast.error("Database connection failed.");
  }
};

  return (
    <section className="settings-section animate-fade-in">
      <h1 className="view-title">Admin Settings</h1>

      {/* Site Configuration */}
      <div className="settings-card premium-card">
        <div className="card-info">
          <h3>Site Configuration</h3>
          {isEditingSite ? (
            <div className="edit-inputs-inline">
              <input 
                type="text" 
                value={config.siteName} 
                className="editable-input"
                onChange={(e) => setConfig({...config, siteName: e.target.value})} 
                placeholder="Site Name"
              />
            </div>
          ) : (
            <p>Site Name: <strong>{config.siteName}</strong></p>
          )}
        </div>
        {!isEditingSite ? (
          <button className="btn-secondary" onClick={() => setIsEditingSite(true)}>Edit</button>
        ) : (
          <button className="btn-save-green" onClick={() => handleSave('Site Config')}>Save</button>
        )}
      </div>

  
      <div className="settings-card premium-card">
        <div className="card-info">
          <h3>Default Job Settings</h3>
          {isEditingJobs ? (
            <select 
              className="editable-input" 
              value={config.defaultCurrency}
              onChange={(e) => setConfig({...config, defaultCurrency: e.target.value})}
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
            </select>
          ) : (
            <p>Default Currency: <strong>{config.defaultCurrency}</strong></p>
          )}
        </div>
        {!isEditingJobs ? (
          <button className="btn-secondary" onClick={() => setIsEditingJobs(true)}>Edit</button>
        ) : (
          <button className="btn-save-green" onClick={() => handleSave('Job Settings')}>Save</button>
        )}
      </div>

    
      <div className="settings-card premium-card highlighted-card">
        <div className="card-info">
          <h3>User Management</h3>
          <p>Manage user roles and permissions.</p>
        </div>
        <button 
          className="btn-primary-pro" 
          onClick={() => setActiveTab('users')} 
        >
          Manage Users
        </button>
      </div>

  
      <div className="settings-card nested-card premium-card">
        <div className="card-header-row">
          <h3>Email Notifications</h3>
          {!isEditingEmail ? (
            <button className="btn-secondary" onClick={() => setIsEditingEmail(true)}>Edit</button>
          ) : (
            <button className="btn-save-green" onClick={() => handleSave('Email Settings')}>Save</button>
          )}
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>From Email</label>
            <input 
              type="email" 
              value={config.fromEmail} 
              readOnly={!isEditingEmail}
              className={isEditingEmail ? "editable-input" : ""}
              onChange={(e) => setConfig({...config, fromEmail: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Notification Template</label>
            <input 
              type="text" 
              value={config.template} 
              readOnly={!isEditingEmail}
              className={isEditingEmail ? "editable-input" : ""}
              onChange={(e) => setConfig({...config, template: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="settings-card nested-card premium-card">
        <div className="card-header-row">
          <h3>System Settings</h3>
          {!isEditingSystem ? (
            <button className="btn-secondary" onClick={() => setIsEditingSystem(true)}>Edit</button>
          ) : (
            <button className="btn-save-green" onClick={() => handleSave('System Settings')}>Save</button>
          )}
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Date Format</label>
            <select 
              disabled={!isEditingSystem} 
              value={config.dateFormat}
              onChange={(e) => setConfig({...config, dateFormat: e.target.value})}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="input-group">
            <label>Timezone</label>
            <input 
              type="text" 
              value={config.timezone} 
              readOnly={!isEditingSystem}
              onChange={(e) => setConfig({...config, timezone: e.target.value})}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminSettings;