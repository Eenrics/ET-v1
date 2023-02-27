import mongoose from "mongoose";

const languagePairSchema = new mongoose.Schema({
  sourceLanguage: {
    type: String,
    enum: ["amharic", "english", "arabic", "tigrigna", "other"],
    required: true,
  },
  targetLanguage: {
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

export default languagePairSchema;
