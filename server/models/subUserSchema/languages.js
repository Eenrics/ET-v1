import mongoose from "mongoose";

const languagesSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["amharic", "english", "arabic", "tigrigna", "other"],
    required: true,
  },
  level: {
    type: String,
    enum: ["none", "beginner", "intermediate", "advanced", "fluent"],
    required: true,
  },
});

export default languagesSchema;
