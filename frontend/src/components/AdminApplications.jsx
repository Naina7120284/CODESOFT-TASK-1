import React, { useState, useEffect } from 'react';
import { MdAssignment, MdSearch, MdPerson, MdBusiness, MdFileDownload } from 'react-icons/md';

const AdminApplications = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [applications, setApplications] = useState([]);
    const [appStats, setAppStats] = useState({ total: 3, pending: 0, shortlisted: 0 });

    useEffect(() => {
    const fetchApps = async () => {
        try {
            const res = await fetch(`${window.API_URL}/api/admin/applications`);
            const data = await res.json();
            if (res.ok) {
                setApplications(data);
                setAppStats({
                    total: data.length,
                    pending: data.filter(a => a.status === 'Pending').length,
                    shortlisted: data.filter(a => a.status === 'Shortlisted').length
                });
            }
        } catch (err) { console.error("Fetch apps failed:", err);
            console.error("Connection failed:", err);
         }
    };
    fetchApps();
}, []);

     const toggleAppStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Pending' ? 'Shortlisted' : 'Pending';
        try {
            const res = await fetch(`${window.API_URL}/api/admin/applications/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
    
                setApplications(applications.map(a => a._id === id ? { ...a, status: newStatus } : a));
            }
        } catch (err) { console.error("Update failed:", err); }
    };

        const exportToCSV = () => {
        const headers = ["Candidate,Email,Job,Company,Status\n"];
        const rows = applications.map(app => 
            `${app.firstName} ${app.lastName},${app.candidateEmail},${app.jobId?.title || app.jobTitle},${app.jobId?.company || app.company},${app.status}`
        ).join("\n");
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Applications_Report.csv';
        a.click();
    };

    return (
        <div className="fade-in">
            <h1 className="view-title">Applications Management</h1>

            <div className="mini-stats-container">
                <div className="mini-stat-box all">
                    <div className="mini-icon"><MdAssignment /></div>
                    <div className="mini-data">
                        <span>All Applications</span>
                        <strong>{appStats.total}</strong>
                    </div>
                </div>
                <div className="mini-stat-box pending">
                    <div className="mini-icon">●</div>
                    <div className="mini-data">
                        <span>Pending</span>
                        <strong>{appStats.pending}</strong>
                    </div>
                </div>
                <div className="mini-stat-box shortlisted">
                    <div className="mini-icon">●</div>
                    <div className="mini-data">
                        <span>Shortlisted</span>
                        <strong>{appStats.shortlisted}</strong>
                    </div>
                </div>
            </div>

            <div className="table-controls">
                <div className="search-box-premium">
                    <MdSearch />
                    <input type="text" placeholder="Search applications..." />
                </div>
               <button className="export-btn" onClick={exportToCSV}>
                <MdFileDownload /> Export CSV
              </button>
            </div>

            <div className="table-container-premium">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Job Position</th>
                            <th>Employer</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                   <tbody>
                       {applications.map((app) => (
                           <tr key={app._id} className="table-row-hover">
                             <td className="job-cell">
                                 <div className="job-icon-circle"><MdPerson /></div>
                                 <div className="job-name-info">
                            
                                    <strong>{app.firstName} {app.lastName}</strong>
                                    <span>{app.candidateEmail}</span>
                              </div>
                        </td>
                      <td>
                             <strong>{app.jobId?.title || app.jobTitle}</strong>
                          </td>
                          <td className="company-name-highlight">
                             <MdBusiness style={{marginRight: '5px'}} />
                             {app.jobId?.company || app.company}
                        </td>
                      <td>
                         <span 
                             className={`status-badge ${app.status.toLowerCase()}`}
                             onClick={() => toggleAppStatus(app._id, app.status)}
                             style={{ cursor: 'pointer' }}
                          >
                              {app.status}
                         </span>
                     </td>
                     <td>
                      <button 
                            className="btn-text-only" 
                            onClick={() => setSelectedApp(app)}
                         >
                            Details
                      </button>
                    </td>
                   </tr>
                ))}
              </tbody>
            </table>
             </div>

{selectedApp && (
    <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
        <div className="premium-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-pro">
                <div className="user-profile-large">
                    <MdPerson />
                </div>
                <div className="header-text">
                    <h2>{selectedApp.firstName} {selectedApp.lastName}</h2>
                    <p>{selectedApp.candidateEmail}</p>
                </div>
                <button className="close-btn-pro" onClick={() => setSelectedApp(null)}>&times;</button>
            </div>

            <div className="modal-body-pro">
                <div className="info-grid-pro">
                    <div className="info-item">
                        <label>Phone Number:</label>
                        <span>{selectedApp.phone}</span>
                    </div>
                    <div className="info-item">
                        <label>Total Experience:</label>
                        <span>{selectedApp.experience} Years:</span>
                    </div>
                    <div className="info-item">
                        <label>Applied For:</label>
                        <span>{selectedApp.jobId?.title || selectedApp.jobTitle}</span>
                    </div>
                </div>

                <div className="resume-section-pro">
                    <label>Candidate Resume:</label>
                    {selectedApp.resume ? (
                         <a 
                            href={`${window.API_URL}${selectedApp.resume}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resume-download-btn"
                           >
                             <MdFileDownload /> View & Download Resume
                        </a>
                    ) : (
                        <span className="no-resume">No resume uploaded</span>
                    )}
                 </div>
              </div>
           </div>
        </div>
       )}
     </div>
    );
};

export default AdminApplications;