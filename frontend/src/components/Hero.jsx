import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaBookmark, FaChevronLeft, 
  FaChevronRight, FaLinkedin, FaTwitter, FaGithub} from 'react-icons/fa';
import './Hero.css';
import ProfileDrawer from '../components/ProfileDrawer';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';


const Hero = () => {
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
  { sender: 'bot', text: "Hi! I'm your JOBBOARD assistant. How can I help you today?" }
]);

const chatContainerRef = useRef(null);
const clearChat = () => {
  setChatHistory([
    { sender: 'bot', text: "Chat cleared! How else can I assist you with your job search?" }
  ]);
};

useEffect(() => {
  if (chatContainerRef.current) {
    const { scrollHeight, clientHeight } = chatContainerRef.current;
    chatContainerRef.current.scrollTo({
      top: scrollHeight - clientHeight,
      behavior: "smooth"
    });
  }
}, [chatHistory]);

  // 1. Initial Data Load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${window.API_URL}/api/jobs`);
        const data = await res.json();
        if (res.ok) setJobs(data);
      } catch (err) {
        console.log("Check if backend terminal is open");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // 2. Search Logic
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${window.API_URL}/api/jobs/search?title=${title}&location=${location}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length === 0) toast.info("No matches found.");
      }
    } catch (err) {
      toast.error("Search failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Save Job Logic
  const handleSaveJob = async (e, jobId) => {
    e.stopPropagation(); 
    if (!user) {
      toast.warning("Please login to save jobs!");
      return;
    }

    try {
      const res = await fetch(`${window.API_URL}/api/users/save-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, jobId })
      });

      if (res.ok) {
        toast.success("Job Bookmarked!");
      } else {
        toast.error("Already saved or error occurred");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

   const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = window.innerWidth < 768 ? 280 : 400; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleSubscribe = (e) => {
  e.preventDefault();
  if (email) {
  
    toast.success(`Success! Job alerts will be sent to: ${email}`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    setEmail(""); 
  } else {
    toast.error("Please enter a valid email address.", {
      theme: "light",
    });
  }
};

const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch(`${window.API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) 
    });

    if (response.ok) {
      toast.success("Message Sent! Check your inbox soon.", { theme: "light" });
      setFormData({ name: "", email: "", message: "" }); 
    } else {
      toast.error("Server error. Please try again later.");
    }
  } catch (err) {
    toast.error("Network error. Is the backend running?");
  }
};

const handleSendMessage = (e) => {
  e.preventDefault();
  if (!chatMessage.trim()) return;

  const newHistory = [...chatHistory, { sender: 'user', text: chatMessage }];
  setChatHistory(newHistory);
  setChatMessage("");

setTimeout(() => {
  let botResponse = "I'm not sure about that. Try asking about our 'Jobs', 'Resume Builder', or 'Career Tips'!";
  const input = chatMessage.toLowerCase();

  // Education and Learning Queries
  if (input.includes("education") || input.includes("study") || input.includes("course")) {
    botResponse = "Education is the foundation of a great career! Master trending skills like React, Node.js, or Cloud Computing to get hired faster.";
  } 
  // Field-Specific Queries
  else if (input.includes("tech") || input.includes("developer") || input.includes("software")) {
    botResponse = "The tech field is booming! I recommend looking at our 'IT & Software' category for 450+ active openings.";
  }
  else if (input.includes("design") || input.includes("ui") || input.includes("ux")) {
    botResponse = "Creative roles are in demand! Check our 'Design' category for the latest UI/UX opportunities.";
  }
  // Platform Knowledge
  else if (input.includes("job") || input.includes("opening") || input.includes("work")) {
    botResponse = "We have 5 active jobs right now from world-class companies like Google and Microsoft! Check the Featured Jobs section.";
  }
  else if (input.includes("company") || input.includes("name")) {
    botResponse = "Our platform is called JOBBOARD! We connect developers with 100+ world-class companies.";
  }
  else if (input.includes("resume") || input.includes("cv")) {
    botResponse = "Our AI Resume Builder is ready! Use our professional templates to beat the ATS and get hired 3x faster.";
  }

  
  

  else if (input.includes("what is") || input.includes("about") || input.includes("site")) {
    botResponse = "JOBBOARD is a premium platform designed to connect world-class talent with 100+ top companies like Google, Meta, and Microsoft."; //
  }

 
  else if (input.includes("category") || input.includes("fields") || input.includes("openings")) {
    botResponse = "We have diverse categories including IT & Software (450+ jobs), Finance (210+ jobs), and Design (85+ jobs). Which field interests you?"; //
  }

 
  else if (input.includes("help") || input.includes("guidance") || input.includes("tips")) {
    botResponse = "Our Career Guidance hub offers expert advice on Resume Writing, Interview Prep, and Skill Upgrading. I can open that page for you!"; //
  }


  else if (input.includes("stats") || input.includes("many jobs") || input.includes("success")) {
    botResponse = "Currently, we have 12k+ Active Jobs, 500+ Partner Companies, and over 8k Success Stories from users hired at firms like Tesla and Amazon."; //
  }


  else if (input.includes("resume") || input.includes("cv") || input.includes("build")) {
    botResponse = "Our AI-powered Resume Builder uses professional templates to help you stand out. You can find it in the banner on the Hero page!"; //
  }
    
    setChatHistory(prev => [...prev, { sender: 'bot', text: botResponse }]);
  }, 800);
};

  return (
    <section className="h-section">
      
      <nav className="glass-navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 50px' }}>
        <Link to="/" className="logo">JOB<span>BOARD</span></Link>
        {user && (
          <div className="user-profile-trigger" onClick={() => setIsDrawerOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'white' }}>Hi, {user.name?.split(' ')[0]}</span>
            <img src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="User" style={{ width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #a78bfa' }} />
          </div>
        )}
      </nav>

      
      <div className="minimal-back-container">
        <button className="minimal-back-arrow" onClick={() => navigate('/')}>
          <FaArrowLeft />
        </button>
      </div>

      <div className="h-content" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.1px' }}>Find your dream job now</h1>

        
        <div className="search-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <div className="search-box glass" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50px', width: '80%', maxWidth: '700px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 15px' }}>
              <FaSearch style={{ color: '#94a3b8', marginRight: '10px' }} />
              <input type="text" placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '0 15px' }}>
              <FaMapMarkerAlt style={{ color: '#94a3b8', marginRight: '10px' }} />
              <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
            </div>
            <button onClick={handleSearch} className="btn-search">Search Jobs</button>
          </div>
        </div>

      
        <div className="featured-jobs-section">
          <h2 className="section-subtitle">Top <span className="accent">Job Openings</span></h2>

          <div style={{ position: 'relative', width: '100%' }}>
      
             {!loading && (
        <>
         <button className="scroll-arrow left-arrow" onClick={() => scroll('left')}>
          <FaChevronLeft />
         </button>
         <button className="scroll-arrow right-arrow" onClick={() => scroll('right')}>
          <FaChevronRight />
         </button>
       </>
      )}

      <div className="jobs-horizontal-scroll" ref={scrollRef}>
      
       {loading ? (
        [1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card"></div>
        ))
      ) : jobs.length > 0 ? (
        jobs.map((job) => (
                  <div key={job._id} className="job-card-naukri" onClick={() => navigate(`/job/${job._id}`)}>
                    <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div className="company-logo-box" style={{ width: '45px', height: '45px', background: 'white', borderRadius: '8px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={job.companyLogo || `https://ui-avatars.com/api/?name=${(job.companyName || job.company)}&background=7c3aed&color=fff&size=128&bold=true`} 
                          alt="logo" 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                          onError={(e) => { e.target.src = "https://img.icons8.com/color/96/company.png"; }}
                        />
                      </div>
                      <span className="badge">{job.jobType || 'Remote'}</span>
                    </div>

                    <h3 className="job-title-card">{job.title}</h3>
                    <p className="company-name-card">{job.companyName || job.company}</p>
                    
                    <div className="job-info-row">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>₹ {job.salary || job.salaryRange}</span>
                    </div>

                    <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button className="view-btn-naukri" style={{ flex: 2 }}>View Details</button>
                        <button 
                            className="save-btn" 
                            onClick={(e) => handleSaveJob(e, job._id)}
                            style={{ flex: 1, background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <FaBookmark />
                        </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-msg">No jobs found in database.</p>
              )}
            </div>
          </div>
        </div>
      </div>
     
<div className="trusted-section">
  <p className="trusted-text">Trusted by 100+ World Class Companies</p>
  <div className="logo-slider">
    <div className="logo-track">
      
      <span>MICROSOFT</span>
      <span>GOOGLE</span>
      <span>TESLA</span>
      <span>AMAZON</span>
      <span>APPLE</span>
      <span>META</span>
      {/* Duplicate for infinite loop */}
      <span>MICROSOFT</span>
      <span>GOOGLE</span>
      <span>TESLA</span>
      <span>AMAZON</span>
      <span>APPLE</span>
      <span>META</span>
    </div>
  </div>
</div>
{/* CATEGORIES SECTION */}
<div className="categories-section">
  <h2 className="section-subtitle">Explore by <span className="accent">Category</span></h2>
  <div className="category-grid">
    <div className="cat-card active-link" onClick={() => window.open('https://wellfound.com/role/l/digital-marketing/india', '_blank')}>
      <div className="cat-icon">💻</div>
      <h3>IT & Software</h3>
      <p>450+ Openings</p>
      <span className="explore-hint">Explore Now →</span>
    </div>
    <div className="cat-card active-link" onClick={() => window.open('https://in.indeed.com/q-software-engineer-2026-jobs.html?vjk=dbb2969efc17ddb5', '_blank')}>
      <div className="cat-icon">📈</div>
      <h3>Marketing</h3>
      <p>120+ Openings</p>
      <span className="explore-hint">Explore Now →</span>
    </div>
  <div className="cat-card active-link" onClick={() => window.open('https://in.linkedin.com/jobs/ui-ux-designer-jobs?position=1&pageNum=0', '_blank')}>
      <div className="cat-icon">🎨</div>
      <h3>Design</h3>
      <p>85+ Openings</p>
      <span className="explore-hint">Explore Now →</span>
    </div>

    {/* Finance */}
    <div className="cat-card active-link" onClick={() => window.open('https://in.linkedin.com/jobs/accounting-finance-jobs-patna?position=1&pageNum=0', '_blank')}>
      <div className="cat-icon">📊</div>
      <h3>Finance</h3>
      <p>210+ Openings</p>
      <span className="explore-hint">Explore Now →</span>
    </div>
  </div>
</div>
{/* CAREER ADVICE SECTION */}
<div className="advice-section">
  <div className="section-header">
    <h2 className="section-subtitle">Career <span className="accent">Advice</span></h2>
     <a 
      href="https://www.coursera.org/articles/category/career-advice/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="view-all-btn"
      style={{ textDecoration: 'none' }}
    >
      Read All Articles
    </a>
  </div>

  <div className="advice-grid">
    <div className="advice-card">
      <div className="advice-image">
        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500&auto=format&fit=crop" alt="Resume" />
      </div>
      <div className="advice-content">
        <span className="tag">Resume Tips</span>
        <h3>How to write a resume to get hired </h3>
        <p>Learn the secrets of ATS-friendly resumes to land more interviews.</p>
        <a 
          href="https://www.coursera.org/articles/how-to-make-a-resume" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="read-more"
        >
          Read Full Article →
        </a>
      </div>
    </div>

    <div className="advice-card">
      <div className="advice-image">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwN9mbdOlUZ6-vrkyy0xxNG_GFPUFy1r8CSQ&s" alt="Interview" />
      </div>
      <div className="advice-content">
        <span className="tag">Interview</span>
        <h3>Top Interview Questions for 2026</h3>
        <p>Prepare for the toughest questions with our expert-approved answers.</p>
       <a 
          href="https://novoresume.com/career-blog/interview-questions-and-best-answers-guide" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="read-more"
        >
          Read Full Article →
        </a>
      </div>
    </div>
  </div>
</div>
{/* --- 1. TRENDING SKILLS --- */}
<div className="skills-section">
  <h2 className="section-subtitle">Trending <span className="accent">Skills</span></h2>
  <div className="skills-cloud">
    {[
      { name: 'React.js', link: 'https://react.dev/' },
      { name: 'Node.js', link: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
      { name: 'Python', link: 'https://www.python.org/about/gettingstarted/' },
      { name: 'AWS', link: 'https://aws.amazon.com/what-is-aws/' },
      { name: 'UI/UX', link: 'https://www.interaction-design.org/literature/topics/ux-design' },
      { name: 'DevOps', link: 'https://roadmap.sh/devops' },
      { name: 'Machine Learning', link: 'https://www.ibm.com/topics/machine-learning' },
      { name: 'Figma', link: 'https://help.figma.com/hc/en-us/articles/360043510233-Get-started-with-Figma' }
    ].map((skill, index) => (
      <a 
        key={index} 
        href={skill.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="skill-tag"
      >
      {skill.name}
      </a>
    ))}
  </div>
</div>

{/* --- SKILL UPGRADING SECTION --- */}
<div className="upgrade-section">
  <div className="section-header">
    <h2 className="section-subtitle">Level Up Your <span className="accent">Career</span></h2>

    <p className="section-desc">Get certified by world-class institutions and increase your hiring chances by 45%.</p>
  </div>

  <div className="course-grid">
    <div className="course-card">
      <div className="course-badge">Best Seller</div>
      <div className="course-icon">⚛️</div>
      <h3>Full Stack React Masterclass</h3>
      <p>Master modern web development with React, Node, and MongoDB.</p>
      <div className="course-meta">
        <span>⭐ 4.9 (12k reviews)</span>
       <a 
          href="https://www.youtube.com/watch?v=bMknfKXIFA8" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="enroll-btn"
        >
          View Course
        </a>
      </div>
    </div>

    <div className="course-card">
      <div className="course-icon">🎨</div>
      <h3>Advanced UI/UX Design</h3>
      <p>Learn Figma, Prototyping, and User Psychology from industry experts.</p>
      <div className="course-meta">
        <span>⭐ 4.8 (8k reviews)</span>
        <a 
          href="https://www.coursera.org/google-certificates/ux-design-certificate" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="enroll-btn"
        >
          View Course
        </a>
      </div>
    </div>

    <div className="course-card">
      <div className="course-icon">☁️</div>
      <h3>AWS Cloud Architect</h3>
      <p>Prepare for the AWS Solutions Architect certification from scratch.</p>
      <div className="course-meta">
        <span>⭐ 4.7 (5k reviews)</span>
        <a 
          href="https://explore.skillbuilder.aws/learn" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="enroll-btn"
        >
          View Course
        </a>
      </div>
    </div>
  </div>
</div>

{/* --- RESUME BUILDER BANNER --- */}
<div className="resume-builder-section">
  <div className="resume-glass-container">
    <div className="resume-text">
      <span className="premium-badge">AI Powered</span>

      <h2 className="resume-heading">
        Create a <span className="accent">Resume</span> that stands out
      </h2>

      <p className="resume-desc">
        Use our professional templates to build a resume that beats the ATS and gets you hired 3x faster.
      </p>
      <div className="resume-features">
        <span>✓ 20+ Pro Templates</span>
        <span>✓ One-Click Export</span>
        <span>✓ ATS Friendly</span>
      </div>
      <a 
        href="https://www.canva.com/resumes/templates/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-search resume-btn"
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        Build My Resume
      </a>
    </div>
    <div className="resume-visual">
     
      <div className="resume-mockup">
        <div className="mock-line long"></div>
        <div className="mock-line medium"></div>
        <div className="mock-grid">
           <div className="mock-box"></div>
           <div className="mock-box"></div>
        </div>
        <div className="mock-line short"></div>
      </div>
    </div>
  </div>
</div>


<div className="testimonials-section">
  <h2 className="section-subtitle">Real Success Stories </h2>
  <div className="testimonial-grid">
    
 
    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=1" alt="User" />
        <div>
          <h4>Anjali Goel</h4>
          <p>Hired at Google</p>
        </div>
      </div>
      <p className="testi-quote">"The premium design and easy application process helped me land my dream role in weeks!"</p>
    </div>

   
    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=2" alt="User" />
        <div>
          <h4>Rahul Sharma</h4>
          <p>Hired at Microsoft</p>
        </div>
      </div>
      <p className="testi-quote">"The horizontal scroll for top jobs is so intuitive. I love the glass-morphism feel!"</p>
    </div>


    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=11" alt="User" />
        <div>
          <h4>Isha Verma</h4>
          <p>Software Engineer @ Amazon</p>
        </div>
      </div>
      <p className="testi-quote">"The real-time search and clean UI allowed me to find a niche backend role at Amazon within a week."</p>
    </div>

    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=12" alt="User" />
        <div>
          <h4>Priya Das</h4>
          <p>Product Designer @ Airbnb</p>
        </div>
      </div>
      <p className="testi-quote">"I was specifically looking for remote roles. This platform's filter system is world-class for global opportunities."</p>
    </div>

  
    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=13" alt="User" />
        <div>
          <h4>Sneha Reddy</h4>
          <p>Data Analyst @ Razorpay</p>
        </div>
      </div>
      <p className="testi-quote">"The newsletter alerts actually work! I applied to Razorpay instantly from an email and got hired."</p>
    </div>

  
    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=14" alt="User" />
        <div>
          <h4>Kunal Kapoor</h4>
          <p>Marketing Head @ Zomato</p>
        </div>
      </div>
      <p className="testi-quote">"I appreciate the glass-morphism design. It makes the job search feel modern and much less stressful."</p>
    </div>

   
    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=15" alt="User" />
        <div>
          <h4>Arjun Mehta</h4>
          <p>DevOps Lead @ Netflix</p>
        </div>
      </div>
      <p className="testi-quote">"The skill-cloud feature helped me identify what I needed to level up. 6 months later, I'm at Netflix!"</p>
    </div>


    <div className="testi-card">
      <div className="testi-user">
        <img src="https://i.pravatar.cc/150?u=16" alt="User" />
        <div>
          <h4>Riya Malhotra</h4>
          <p>Junior Developer @ Flipkart</p>
        </div>
      </div>
      <p className="testi-quote">"Even as a fresher, I didn't feel overwhelmed. I found my first high-paying internship here easily."</p>
    </div>

  </div>
</div>
{/* NEWSLETTER SECTION */}
<div className="newsletter-box">
  <div className="newsletter-glass">
    <h2>Don't miss out on <span className="accent">New Opportunities</span></h2>
    <p>Subscribe to get the latest job alerts and career tips delivered to your inbox.</p>
    <form className="subscribe-form" onSubmit={handleSubscribe}>
      <input 
        type="email" 
        placeholder="Enter your email address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}required
        />
      <button type="submit" className="btn-search subscribe-btn">Subscribe Now</button>
    </form>
  </div>
</div>
{/* --- JOB STATISTICS COUNTER --- */}
<div className="stats-section">
  <div className="stats-grid">
    <div className="stat-item">
      <h2 className="stat-number">12k+</h2>
      <p className="stat-label">Active Jobs</p>
    </div>
    <div className="stat-item">
      <h2 className="stat-number">500+</h2>
      <p className="stat-label">Companies</p>
    </div>
    <div className="stat-item">
      <h2 className="stat-number">8k+</h2>
      <p className="stat-label">Success Stories</p>
    </div>
    <div className="stat-item">
      <h2 className="stat-number">24/7</h2>
      <p className="stat-label">Expert Support</p>
    </div>
  </div>
</div>
{/* --- CONTACT US SECTION --- */}
<div className="contact-section">
  <div className="section-header">
    <h2 className="section-subtitle">Get in <span className="accent">Touch</span></h2>
    <p className="section-desc">Have questions? Our team is here to help you navigate your career journey.</p>
  </div>

  <div className="contact-container">
    <div className="contact-info">
      <div className="info-item">
        <span className="info-icon">📍</span>
        <div>
          <h4>Visit Us</h4>
          <p>123 Career Blvd, Tech City</p>
        </div>
      </div>
      <div className="info-item">
        <span className="info-icon">📧</span>
        <div>
          <h4>Email Support</h4>
          <p>jobboard326@gmail.com</p>
        </div>
      </div>
    </div>

    <form className="contact-form glass" onSubmit={handleContactSubmit}>
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Your Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <input 
          type="email" 
          placeholder="Your Email" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <textarea 
        placeholder="How can we help?"
        rows="4"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
        ></textarea>
      </div>
      <button type="submit" className="btn-search contact-btn">Send Message</button>
    </form>
  </div>
</div>

{/* --- FLOATING CHAT BUBBLE --- */}
<div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
  {isChatOpen && (
    <div className="chat-window-glass" style={{ marginBottom: '20px' }}>
      <div className="chat-header-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
          <span style={{ color: '#1e1b4b', fontWeight: '700', fontSize: '1rem' }}>JOBBOARD AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span onClick={clearChat} style={{ color: '#7c3aed', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>
            Clear
          </span>
          <button className="chat-close-x" onClick={() => setIsChatOpen(false)} style={{ color: '#1e1b4b', border: 'none', background: 'none', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
      </div>

      <div className="chat-body-scroll" ref={chatContainerRef} style={{ height: '350px', overflowY: 'auto' }}>
        {chatHistory.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input 
          type="text" 
          placeholder="Compose your message..." 
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <button type="submit" className="send-arrow-btn">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  )}
  <div className="floating-chat" onClick={() => setIsChatOpen(!isChatOpen)}>
    <span className="chat-icon">💬</span>
    <span className="chat-tooltip">Need help?</span>
  </div>
</div>
{/* FOOTER SECTION */}
<footer className="main-footer">
  <div className="footer-content">
    <div className="footer-brand">
      <Link to="/" className="logo">JOB<span>BOARD</span></Link>
      <p>Empowering careers through world-class opportunities and professional growth.</p>
    </div>
    
    <div className="footer-links">
      <h4>Platform</h4>
      <Link to="#">Browse Jobs</Link>
      <Link to="#">Categories</Link>
      <Link to="#">Companies</Link>
    </div>

    <div className="footer-links">
      <h4>Support</h4>
      <Link to="#">Help Center</Link>
      <Link to="#">Privacy Policy</Link>
      <Link to="#">Terms of Service</Link>
    </div>
  </div>
  
  <div className="footer-bottom">
    <p>&copy; 2026 JOBBOARD. All rights reserved.</p>
    <div className="social-icons" style={{ display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
    <a 
      href="https://www.linkedin.com/company/your-jobboard" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ color: '#64748b' }}
    >
      <FaLinkedin />
   </a>
    <a 
      href="https://twitter.com/your-jobboard" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ color: '#64748b' }}
    >
      <FaTwitter />
    </a>
    <a 
      href="https://github.com/your-username/job-board" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ color: '#64748b' }}
    >
      <FaGithub />
    </a>
</div>
  </div>
</footer>   
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        theme="light"
      />
      {user && <ProfileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} />}
    </section>
  );
};

export default Hero;