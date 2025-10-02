import express from "express";
import emailQueue from "../queues/emailQueue.js";

const router = express.Router();

router.post("/", async (req, res) => {
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

  try {
    await emailQueue.add({ name, email, message });
    return res.status(200).json({
      success: true,
      message: "Message received! Email will be sent shortly.",
    });
  } catch (err) {
    console.error("Queue error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to process request." });
  }
});

export default router;
