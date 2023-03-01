import mongoose from "mongoose";

const baseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter project name"],
    min: 2,
    max: 30,
  },
  description: {
    type: String,
    required: [true, "Please enter project description"],
    min: 100,
  },
  startDate: {
    type: Date,
    required: [true, "Please enter project start date"],
  },
  deadLine: {
    type: Date,
    required: [true, "Please enter project end date"],
  },
  status: {
    type: String,
    enum: [
      "Not started",
      "In progress",
      "Completed",
      "Failed",
      "Paused",
      "Canceled",
    ],
    default: "Not started",
  },
  budget: {
    type: Number,
    required: [true, "Please enter project budget"],
  },
});

export default baseSchema;
