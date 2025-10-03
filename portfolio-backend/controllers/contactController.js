// import emailQueue from "../queues/emailQueue.js";
// import { validationResult } from "express-validator";

// // Contact controller
// const contact = async (req, res) => {
//   const { name, email, message } = req.body;

//   // Basic validation
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

//   try {
//     // Add email job to queue (async)
//     await emailQueue.add({ name, email, message });

//     // Immediate response to user
//     return res.status(200).json({
//       success: true,
//       message: "Message received! Email will be sent shortly.",
//     });
//   } catch (error) {
//     console.error("Queue error:", error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Failed to process request." });
//   }
// };

// export default contact;
