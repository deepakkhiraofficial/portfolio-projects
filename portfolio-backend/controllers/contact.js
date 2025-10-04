import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

const sendEmail = async ({ name, email, message }) => {
  try {
    // ✅ Correct Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
      service: "gmail", // use Gmail’s predefined service
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // ✅ Optional: verify SMTP connection
    transporter.verify((err, success) => {
      if (err) console.error("❌ SMTP Connection Error:", err);
      else console.log("✅ SMTP Server is ready to send emails");
    });

    const mailOptions = {
      from: `"${name}" <${EMAIL_USER}>`,
      to: EMAIL_USER, // send to yourself
      replyTo: email,
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Email send error:", error.message);
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

  // ✅ Immediate response (non-blocking)
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
