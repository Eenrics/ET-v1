import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: [
      "none",
      "highschool",
      "certificate",
      "diploma",
      "degree",
      "masters",
      "phd",
    ],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  completedAt: {
    type: Date,
    required: true,
  },
});

export default educationSchema;
