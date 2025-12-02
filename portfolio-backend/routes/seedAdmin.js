// run with: node seedAdmin.js
import("dotenv").config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const username = "admin";
  const plain = process.env.ADMIN_PASSWORD || "ChangeThis123!";
//   const existing = await User.findOne({ username });
  const existing = await User.findOne({ username });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }
  const hash = await bcrypt.hash(plain, 10);
  const u = new User({ username, passwordHash: hash, role: "admin" });
  await u.save();
  console.log("Admin created:", username);
  process.exit(0);
})();
