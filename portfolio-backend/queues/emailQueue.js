import Queue from "bull";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js";

const emailQueue = new Queue("emailQueue");

// Use Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS, // must be app password if using Gmail
  },
});

// Process email jobs
emailQueue.process(async (job) => {
  const { name, email, message } = job.data;
  await transporter.sendMail({
    from: `"Portfolio Contact" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
});

export default emailQueue;
