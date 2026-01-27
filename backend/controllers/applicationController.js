import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer'; 

// --- PRIVATE EMAIL ENGINE ---
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });
  return await transporter.sendMail(options);
};

export const submitApplication = async (req, res) => {
    try {
        console.log("Incoming Body:", req.body);

        // 1. ADD THIS LINE: Destructure everything you need from req.body
        const { 
            userId, jobId, jobTitle, company, 
            candidateEmail, firstName, lastName, 
            phone, experience, currentCity 
        } = req.body;

        // 2. Prepare the data for MongoDB
        const applicationData = {
            userId,
            jobId,
            jobTitle,
            company,
            candidateEmail,
            firstName,
            lastName,
            phone,
            experience,
            currentCity,
            // Capture the uploaded file path
            resume: req.file ? `/uploads/${req.file.filename}` : "", 
            status: "Pending"
        };

        const newApp = new Application(applicationData);
        const savedApp = await newApp.save();
        


        // Send Confirmation Email
        const applicationMail = {
          from: '"JobBoard" <no-reply@jobboard.com>',
          to: candidateEmail, 
          subject: `Application Received: ${jobTitle}`,
          html: `
            <div style="background-color: #000000; padding: 40px 20px; font-family: 'Segoe UI', sans-serif;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #1a1a1a; border-radius: 20px; border: 1px solid #333333; overflow: hidden;">
                <tr>
                  <td style="padding: 30px; background-color: #111111; border-bottom: 1px solid #333333; text-align: center;">
                    <div style="font-size: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                      <span style="color: #ffffff;">JOB</span><span style="color: #a78bfa;">BOARD</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <h2 style="color: #a78bfa; font-size: 22px; margin-bottom: 15px;">Application Confirmed!</h2>
                    <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
                      Hello ${firstName}, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.
                    </p>
                  </td>
                </tr>
              </table>
            </div>`
        };

      try {
            await sendEmail(applicationMail);
            console.log("Confirmation email sent successfully.");
        } catch (emailError) {
            console.error("EMAIL SERVICE ERROR (Application still saved):", emailError.message);
        }
        return res.status(201).json({ message: "Success!", data: savedApp });

    } catch (error) {
        console.error("SUBMISSION ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
};
// 2. GET CANDIDATE APPLICATIONS (Preserved)
export const getCandidateApplications = async (req, res) => {
    try {
        const apps = await Application.find({ userId: req.params.candidateId });
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. GET EMPLOYER APPLICATIONS (Preserved)
export const getEmployerApplications = async (req, res) => {
    try {
        const { employerId } = req.params;
        const jobs = await Job.find({ employerId: employerId });
        const jobIds = jobs.map(job => job._id);
        const applications = await Application.find({ jobId: { $in: jobIds } });
        res.status(200).json(applications);
    } catch (err) {
        res.status(500).json({ message: "Fetch failed", error: err.message });
    }
};

// 4. UPDATE STATUS (Preserved)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { appId } = req.params;
        const { status } = req.body;
        const updatedApp = await Application.findByIdAndUpdate(appId, { status: status }, { new: true });
        res.status(200).json(updatedApp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};