import nodemailer from "nodemailer";

// Async email sending function
const sendEmail = async ({ name, email, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // ✅ always your Gmail
      replyTo: email, // ✅ sender email
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

// Controller
const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid email address." });
  }

  // ✅ Send immediate response to frontend
  res
    .status(200)
    .json({
      success: true,
      message: "Message received! We'll contact you soon.",
    });

  // ✅ Send email asynchronously (does not block frontend)
  sendEmail({ name, email, message }).catch((err) => {
    console.error("Failed to send contact email:", err);
  });
};

export default contact;
