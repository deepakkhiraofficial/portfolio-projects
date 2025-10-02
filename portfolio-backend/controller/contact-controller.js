import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailRegex = /^\S+@\S+\.\S+$/;

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid email address." });
  }

  try {
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      // html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send message." });
  }
};

export default contact;
