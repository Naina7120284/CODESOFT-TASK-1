import React, { useState, useEffect } from 'react';
import './ProfileUpdateModal.css';
import { toast } from 'react-toastify';

const ProfileUpdateModal = ({ isOpen, onClose, fieldType, userId, onUpdateSuccess }) => {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

 
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);


  useEffect(() => {
    if (isOpen) {
      setValue("");
      setOtp("");
      setStep(1);
      setTimer(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

 
  const handleInitialAction = async () => {
    if (!value) return toast.error(`Please enter your ${fieldType}`);

    if (fieldType === 'mobile' && value.length < 10) {
      return toast.error("Please enter a valid mobile number");
    }

    setLoading(true);
    try {
      const res = await fetch(`${window.API_URL}/api/users/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, [fieldType]: value })
      });

      const data = await res.json();

      if (res.ok) {
        toast.info(data.message || "Verification code sent!");
        setStep(2);
        setTimer(60); 
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) return toast.error("Please enter the complete 4-digit code");

    setLoading(true);
    try {
       const res = await fetch(`${window.API_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp, [fieldType]: value })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Verified! Check your email for confirmation.");
        onUpdateSuccess(data.user); 
        onClose(); 
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-master-overlay" onClick={onClose}>
      <div className="modal-glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {step === 1 ? `Update ${fieldType}` : "Confirm Identity"}
          </h3>
          <p className="modal-subtitle">
            {step === 1
              ? `Enter your new ${fieldType} to receive a secure verification code.`
              : `A 4-digit code has been sent to your registered email.`
            }
          </p>
        </div>

        <div className="modal-body">
          {step === 1 ? (
            <div className="input-group">
              <label className="input-label">New ${fieldType}</label>
              {fieldType === 'education' ? (
                <textarea
                  placeholder="Enter your qualification..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="glass-input modal-textarea"
                  autoFocus
                />
              ) : (
                <input
                  type="tel"
                  placeholder="e.g. 9336646107"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="glass-input"
                  autoFocus
                />
              )}
            </div>
          ) : (
            <div className="otp-group">
              <input
                type="text"
                maxLength="4"
                placeholder="• • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                className="glass-input otp-field"
                autoFocus
              />
              <div className="resend-container">
                {timer > 0 ? (
                  <span className="timer-text">Resend code in <strong>{timer}s</strong></span>
                ) : (
                  <button className="resend-btn" onClick={handleInitialAction} disabled={loading}>
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={step === 1 ? handleInitialAction : handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Processing..." : step === 1 ? "Get Code" : "Verify & Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;