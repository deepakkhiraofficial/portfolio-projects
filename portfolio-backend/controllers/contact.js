import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

const sendEmail = async ({ name, email, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const mailOptions = {
    from: `"${name}" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    replyTo: email,
    subject: `📩 New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };

  await transporter.sendMail(mailOptions);
};

// const contact = async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message)
//     return res.status(400).json({ error: "All fields are required" });

//   res.status(200).json({ message: "Message received!" });

//   sendEmail({ name, email, message }).catch((err) => {
//     console.error("Email send failed:", err.message);
//   });
// };

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    await sendEmail({ name, email, message }); // ✅ wait here
    res.status(200).json({ message: "Message received and email sent!" });
  } catch (err) {
    console.error("Email send failed:", err.message);
    res.status(500).json({ error: "Email failed to send" });
  }
};


export default contact; // ✅ important
