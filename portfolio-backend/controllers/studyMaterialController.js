import StudyMaterial from "../models/StudyMaterial.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------
// Helper: Normalize Tags
// ------------------------------
const normalizeTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);

  if (typeof tags === "string")
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  return [];
};

// ------------------------------
// GET: All Study Materials
// ------------------------------
export const getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    return res.status(200).json(materials);
  } catch (err) {
    console.error("GET ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch materials" });
  }
};

// ------------------------------
// POST: Create Study Material
// ------------------------------
export const createMaterial = async (req, res) => {
  try {
    const { subject, title, description, tags, externalLink } = req.body;

    // Validate required fields
    if (!subject || !title || !description) {
      return res.status(400).json({
        message: "Subject, title and description are required",
      });
    }

    // Prevent duplicate titles
    const existing = await StudyMaterial.findOne({ title });
    if (existing) {
      return res.status(400).json({
        message: "A material with this title already exists",
      });
    }

    // File URL if uploaded
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const material = new StudyMaterial({
      subject,
      title,
      description,
      tags: normalizeTags(tags),
      externalLink,
      fileUrl,
    });

    await material.save();

    return res.status(201).json({
      message: "Material created successfully",
      material,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ message: "Failed to create material" });
  }
};

// ------------------------------
// PUT: Update Study Material
// ------------------------------
export const updateMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material)
      return res.status(404).json({ message: "Material not found" });

    const { subject, title, description, tags, externalLink } = req.body;

    material.subject = subject ?? material.subject;
    material.title = title ?? material.title;
    material.description = description ?? material.description;
    material.tags = tags ? normalizeTags(tags) : material.tags;
    material.externalLink = externalLink ?? material.externalLink;

    // Replace file if new one uploaded
    if (req.file) {
      if (material.fileUrl) {
        const oldPath = path.join(__dirname, "..", material.fileUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      material.fileUrl = `/uploads/${req.file.filename}`;
    }

    await material.save();

    return res.status(200).json({
      message: "Material updated successfully",
      material,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ message: "Failed to update material" });
  }
};

// ------------------------------
// DELETE: Study Material
// ------------------------------
export const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material)
      return res.status(404).json({ message: "Material not found" });

    // Delete file
    if (material.fileUrl) {
      const filePath = path.join(__dirname, "..", material.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await material.deleteOne();

    return res.status(200).json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: "Failed to delete material" });
  }
};
