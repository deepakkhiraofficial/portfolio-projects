import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

// Send email helper
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

// POST /api/contact
export const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save to DB
    const newContact = await Contact.create({ name, email, message });

    // Send email
    await sendEmail({ name, email, message });

    res.status(201).json({
      message: "Message received and email sent!",
      contact: newContact,
    });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Failed to save/send message" });
  }
};

// GET /api/contact - fetch all messages
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
  } catch (err) {
    console.error("Fetch contacts error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
export default { createContact, getContacts };