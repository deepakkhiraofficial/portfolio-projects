// import nodemailer from "nodemailer";

// const sendEmail = async ({ name, email, message }) => {
//   try {
//     // Create a secure SMTP transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true, // true for 465, false for 587
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Verify connection before sending
//     await transporter.verify();
//     console.log("✅ Gmail transporter ready");

//     // Email content
//     const mailOptions = {
//       from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
//       replyTo: email,
//       to: process.env.EMAIL_USER, // receives mail at your Gmail
//       subject: `New Contact Message from ${name}`,
//       text: `📩 New message from your portfolio site:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully:", info.response);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error.message);
//   }
// };

// export const contact = async (req, res) => {
//   const { name, email, message } = req.body;

//   // Validate inputs
//   if (!name || !email || !message) {
//     return res
//       .status(400)
//       .json({ success: false, error: "All fields are required." });
//   }

//   const emailRegex = /^\S+@\S+\.\S+$/;
//   if (!emailRegex.test(email)) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Invalid email address." });
//   }

//   // ✅ Respond immediately to frontend
//   res.status(200).json({
//     success: true,
//     message: "Message received! We'll contact you soon.",
//   });

//   // ✅ Send email asynchronously
//   sendEmail({ name, email, message }).catch((err) =>
//     console.error("Background email send failed:", err)
//   );
// };

// export default contact;

import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

// Async email sending function
const sendEmail = async ({ name, email, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
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

