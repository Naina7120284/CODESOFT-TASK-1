import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import './JobDetails.css';

const JobDetails = ({ isModal, modalJobId, onClose, openDirectly = true, fetchApplications }) => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();


    const jobId = isModal ? modalJobId : routeId;

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        experience: '', currentCity: '', gender: ''
    });


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { 
                toast.error("File size exceeds 1MB");
                return;
            }
            setSelectedFile(file);
            toast.success(`Resume "${file.name}" attached!`);
        }
    };

   
const handleApply = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        toast.error("Please login to apply!");
        return;
    }

    if (!selectedFile) {
        toast.error("Please upload your resume first!");
        return;
    }
    try {
        const dataToSend = new FormData();
        dataToSend.append('resume', selectedFile);
        dataToSend.append('userId', user._id);
        dataToSend.append('jobId', job._id);
        dataToSend.append('jobTitle', job.title);
        dataToSend.append('company', job.companyName || job.company);
        dataToSend.append('candidateEmail', user.email);
        dataToSend.append('firstName', formData.firstName);
        dataToSend.append('lastName', formData.lastName);
        dataToSend.append('phone', formData.phone);
        dataToSend.append('experience', formData.experience);
        dataToSend.append('currentCity', formData.currentCity);
        dataToSend.append('gender', formData.gender);

     
       const res = await fetch(`${window.API_URL}/api/applications/submit`, {
            method: 'POST',
            body: dataToSend
        });

        const data = await res.json();
        if (res.ok) {
            toast.success("Application submitted successfully!");
            setIsModalOpen(false);
            if (isModal) onClose(); 
            if (typeof fetchApplications === 'function') fetchApplications(user._id);
        } else {
            toast.error(data.error || "Submission failed.");
        }
    } catch (err) {
        console.error("Submit Error:", err);
        toast.error("Server error. Please check your connection.");
    }
};

    useEffect(() => {
        const user = localStorage.getItem('user');
    if (!user) {
        toast.error("Access denied. Please login first.");
        navigate('/auth');
        return;
    }
        fetch(`${window.API_URL}/api/jobs/${jobId}`)
            .then(res => res.json())
            .then(data => {
                setJob(data);
                setLoading(false);
            })
            .catch(err => {
                toast.error("Failed to load job details");
                setLoading(false);
            });
    }, [jobId]);


    useEffect(() => {
        if (isModal && openDirectly) {
            setIsModalOpen(true);
        }
    }, [isModal, openDirectly]);

    if (loading && !(isModal && openDirectly)) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    return (
        <div className={`job-details-master ${isModal ? 'as-modal' : ''}`}>

           
            {(!(isModal && openDirectly)) && (
                <div className="job-details-card glass animate-fade-in">
                    {!isModal && (
                        <button className="back-arrow-btn crystal-circle" onClick={() => navigate(-1)}>
                            <FaArrowLeft />
                        </button>
                    )}
                    <div className="job-header-section">
                        <h1>{job?.title}</h1>
                        <p className="company-name">{job?.companyName || job?.company}</p>
                    </div>

                    <div className="job-info-grid">
                        <div className="info-item"><FaMapMarkerAlt /> <span>{job?.location}</span></div>
                        <div className="info-item"><FaBriefcase /> <span>{job?.jobType}</span></div>
                        <div className="info-item"><FaMoneyBillWave /> <span>{job?.salary}</span></div>
                    </div>

                    <div className="job-content-area">
                        <div className="job-description">
                            <h3>Description</h3>
                            <p className="formatted-text">{job?.description}</p>
                        </div>
                    </div>

                    <button className="apply-now-main-btn" onClick={() => setIsModalOpen(true)}>
                        Apply for this Position
                    </button>
                </div>
            )}

           
            {isModalOpen && (
                <div className="apply-modal-overlay animate-overlay-smooth">
                    <div className="apply-glass-modal professional-form animate-modal-pop">
                        <button className="close-modal" onClick={() => {
                            setIsModalOpen(false);
                            if (isModal && openDirectly) onClose();
                        }}>&times;</button>

                        <div className="modal-header">
                            <h2>Application Form</h2>
                            <p>Apply for <span className="purple-text">{job?.title || 'this position'}</span></p>
                        </div>

                        <form onSubmit={handleApply} className="modal-form-scrollable">
                            <div className={`resume-upload-zone ${selectedFile ? 'file-attached' : ''}`}>
                                <p>Upload Resume (Max 1MB)</p>
                                <label className="upload-label">
                                    {selectedFile ? <span>✅ {selectedFile.name}</span> : <span>Click to upload</span>}
                                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                </label>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input type="text" required placeholder="John" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <input type="text" required placeholder="Doe" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" required placeholder="john@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input type="tel" required placeholder="+91 ..." onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>Years of Experience</label>
                                    <input type="number" required placeholder="e.g. 2" onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Current City</label>
                                    <input type="text" required placeholder="e.g. Mumbai" onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })} />
                                </div>
                            </div>

                            <button  type="submit" className="submit-app-btn">Submit Application</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;