import nodemailer from "nodemailer";

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

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // must be App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // ✅ use your Gmail
      replyTo: email, // ✅ reply will go to sender
      to: process.env.EMAIL_USER, // ✅ your inbox
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Email error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send message." });
  }
};

export default contact;
