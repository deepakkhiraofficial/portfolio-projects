import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

// send email
const sendEmail = async ({ name, email, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"${name}" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    replyTo: email,
    subject: `New Contact Form from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  });
};

export const createContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const newContact = await Contact.create({ name, email, message });
    await sendEmail({ name, email, message });
    res
      .status(201)
      .json({
        message: "Message received and email sent!",
        contact: newContact,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save/send message" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
