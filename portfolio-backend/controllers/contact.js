import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

// Async email sending function
const sendEmail = async ({ name, email, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.verify((err, success) => {
      if (err) console.error("SMTP Connection Error:", err);
      else console.log("✅ Server is ready to take messages");
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

   const info = await transporter.sendMail(mailOptions);
   console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};

// Controller
const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email))
    return res
      .status(400)
      .json({ success: false, error: "Invalid email address." });

  // ✅ Send immediate response
  res.status(200).json({
    success: true,
    message: "Message received! We'll contact you soon.",
  });

  // ✅ Send email asynchronously
  sendEmail({ name, email, message }).catch((err) => {
    console.error("❌ Failed to send contact email:", err.message);
  });
};

export default contact;

