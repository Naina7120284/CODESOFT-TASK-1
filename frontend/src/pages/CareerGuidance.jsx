import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CareerGuidance.css';

const CareerGuidance = () => {
  const navigate = useNavigate();

  const guidanceSteps = [
    {
      title: "Resume Writing Tips",
      desc: "Learn how to make your resume stand out to recruiters in 2026.",
      icon: "📄",
      link: "https://www.coursera.org/articles/how-to-make-a-resume"
    },
    {
      title: "Interview Preparation",
      desc: "Top 50 common interview questions and how to answer them perfectly.",
      icon: "🤝",
      link: "https://novoresume.com/career-blog/interview-questions-and-best-answers-guide"
    },
    {
      title: "Skill Upgrading",
      desc: "Identify the most in-demand skills for your specific career path.",
      icon: "📈",
      link: "https://www.coursera.org/articles/upskilling?"
    }
  ];

  return (
    <div className="guidance-container">
      <header className="guidance-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Career Guidance & Tips</h1>
        <p>Expert advice to help you land your dream job</p>
      </header>

      <div className="guidance-grid">
        {guidanceSteps.map((step, index) => (
          <div className="guidance-card" key={index}>
            <div className="card-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
         
            <button 
              className="read-more-btn" 
              onClick={() => window.open(step.link, '_blank')}
            >
              Read Articles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerGuidance;