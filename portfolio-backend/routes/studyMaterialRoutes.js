import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../controllers/studyMaterialController.js";

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});
const upload = multer({ storage });

router.get("/", getMaterials);
router.post("/", upload.single("file"), createMaterial);
router.put("/:id", upload.single("file"), updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;
