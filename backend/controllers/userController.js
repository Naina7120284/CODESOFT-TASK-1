import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Settings from '../models/Settings.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      },
      tls: {
        rejectUnauthorized: false 
      }
    });
    return await transporter.sendMail(options);
  } catch (error) {
    console.error("CRITICAL: Email failed to send, but continuing update:", error.message);
    return null; 
  }
};

const LOGO_HTML = `
  <tr>
    <td style="padding: 30px; background-color: #111111; border-bottom: 1px solid #333333; text-align: center;">
      <div style="font-size: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
        <span style="color: #ffffff;">JOB</span><span style="color: #a78bfa;">BOARD</span>
      </div>
    </td>
  </tr>`;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate', 
      isProfileComplete: false
    });

    await user.save();
    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed: " + error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    const siteSettings = await Settings.findOne();
    const customSubject = siteSettings?.template || "Security Alert: Password Changed";
    const customFrom = siteSettings?.fromEmail || "no-reply@jobboard.com";
    const mailOptions = {
      from: `"JobBoard Security" <${customFrom}>`,
      to: user.email,
      subject: customSubject,
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
                <h2 style="color: #f87171; font-size: 22px; margin-bottom: 15px;">Password Updated</h2>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
                  Hello ${user.name}, the password for your account was recently changed.
                </p>
                <p style="color: #666666; font-size: 14px; margin-top: 20px;">
                  If you did not make this change, please contact support immediately.
                </p>
              </td>
            </tr>
          </table>
        </div>`
    };
    await sendEmail(mailOptions);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, mobile } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 5 * 60000); 

    const user = await User.findByIdAndUpdate(userId, { otpCode: otp, otpExpires: expires }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendEmail({
      from: '"JobBoard Security" <no-reply@jobboard.com>',
      to: user.email,
      subject: `Verification Code: ${otp}`,
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
                <h2 style="color: #a78bfa; font-size: 22px; margin-bottom: 15px;">Security Verification</h2>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
                  Use the code below to verify your number: <br/>
                  <strong style="color: #ffffff;">${mobile || 'N/A'}</strong>
                </p>
                <div style="margin: 30px 0; background-color: #111111; padding: 25px; border-radius: 12px; border: 1px solid #444444;">
                  <span style="font-size: 40px; font-weight: bold; color: #a78bfa; letter-spacing: 12px;">${otp}</span>
                </div>
                <p style="color: #f87171; font-size: 13px;">Code expires in 5 minutes.</p>
              </td>
            </tr>
          </table>
        </div>`
    });

    console.log(`\n>>> DEV OTP FOR ${user.email}: [ ${otp} ] <<<\n`);
    res.status(200).json({ message: "Code sent! Check email/terminal." });
  } catch (error) {
    res.status(500).json({ message: "Error sending code", error: error.message });
  }
};

export const updateProfileFull = async (req, res) => {
    try {
        console.log("Starting Profile Update for User:", req.body.userId);
        
        const { userId, name, headline, mobile, location, bio } = req.body;
        
        const updateData = {
            name,
            headline,
            mobile,
            location,
            bio,
            isProfileComplete: true
        };

        if (req.file) {
            console.log("Resume Uploaded to:", req.file.path);
            updateData.resumeUrl = req.file.path; 
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: false }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile Updated", user: updatedUser });
    } catch (err) {
        console.error("DETAILED ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const verifyOtpAndUpdate = async (req, res) => {
  try {
    const { userId, otp, mobile, education } = req.body;
    const user = await User.findById(userId);

    if (!user || user.otpCode !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const updateData = {};
    if (mobile) updateData.mobile = mobile;
    if (education) updateData.education = education;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData, $unset: { otpCode: "", otpExpires: "" }, isMobileVerified: true },
      { new: true }
    );

    const successMail = {
      from: '"JobBoard" <no-reply@jobboard.com>',
      to: updatedUser.email,
      subject: "Profile Updated Successfully",
      html: `
      <div style="background-color: #f3f4f6; padding: 40px 10px; font-family: sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding: 30px; background-color: #10b981; text-align: center; color: white;">
                <div style="font-size: 40px; margin-bottom: 10px;">✓</div>
                <h2 style="margin: 0;">Update Successful</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p>Hello <strong>${updatedUser.name}</strong>,</p>
                <p>Your profile information on <strong>JobBoard</strong> has been successfully updated with the following details:</p>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <p style="margin: 5px 0;"><strong>Mobile:</strong> ${updatedUser.mobile || 'N/A'}</p>
                  <p style="margin: 5px 0;"><strong>Education:</strong> ${updatedUser.education || 'Updated'}</p>
                </div>
                <p style="color: #4b5563; line-height: 1.5;">You are now eligible for personalized job alerts matching your new details!</p>
                <p style="margin-top: 25px; font-size: 14px; color: #9ca3af;">Best Regards,<br>The JobBoard Team</p>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    await sendEmail(successMail);
    res.status(200).json({ message: "Verified & Profile Updated!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { profilePic: req.file.path }, 
      { new: true }
    );
    
    res.status(200).json({ message: "Avatar updated!", profilePic: updatedUser.profilePic });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedJobs: jobId } }, 
      { 
        new: true, 
        runValidators: false,
        context: 'query' 
      }
    ).select('-password'); 

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ 
      message: "Removed from saved list", 
      savedJobs: updatedUser.savedJobs 
    });
  } catch (error) {
    console.error("Deep Error:", error.message);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};