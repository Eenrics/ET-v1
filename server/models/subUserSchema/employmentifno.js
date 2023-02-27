import mongoose from "mongoose";

const employmentifnoSchema = new mongoose.Schema({
  // employmentStatus
  employmentStatus: {
    type: String,
    enum: ["employed", "unemployed"],
  },
  // tinNumber
  tinNumber: {
    type: String,
    default: null,
  },
  // jobTitle
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Freelance", "Contract", "Other"],
  },
  salary: {
    amount: Number,
    currency: {
      type: String,
      default: "ETB",
    },
    type: {
      type: String,
      enum: ["Per month", "Per job", "Per word", "Per contract"],
    },
  },
});
