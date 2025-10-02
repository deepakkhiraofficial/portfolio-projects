import Queue from "bull";
import nodemailer from "nodemailer";
import {
  REDIS_HOST,
  REDIS_PORT,
  EMAIL_USER,
  EMAIL_PASS,
} from "../config/config.js";

const emailQueue = new Queue("emailQueue", {
  redis: { host: REDIS_HOST, port: REDIS_PORT },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  pool: true,
  maxConnections: 5,
  rateLimit: 10,
});

emailQueue.process(async (job) => {
  const { name, email, message } = job.data;

  const mailOptions = {
    from: `"Portfolio Contact" <${EMAIL_USER}>`,
    replyTo: email,
    to: EMAIL_USER,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<h2>New Contact Message</h2>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong></p>
           <p>${message}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
  return info;
});

export default emailQueue;
