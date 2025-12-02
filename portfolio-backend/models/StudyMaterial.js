import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    externalLink: { type: String },
    fileUrl: { type: String }, // store uploaded file URL
    imageUrl: { type: String }, // optional thumbnail or image
  },
  { timestamps: true }
);

export default mongoose.model("StudyMaterial", studyMaterialSchema);
