import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'jobboard326@gmail.com',
    pass: 'ftdy xbjx ufgf tpcv' 
  }
});

router.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: 'jobboard326@gmail.com', 
    subject: `New Career Inquiry from ${name}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #7c3aed; border-radius: 10px;">
        <h2 style="color: #7c3aed;">New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message delivered successfully!' });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});
export default router;