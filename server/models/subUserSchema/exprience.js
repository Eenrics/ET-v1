import mongoose from "mongoose";

const exprienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter the job title"],
  },
  description: {
    type: String,
    required: [true, "Please enter a short description"],
    maxLength: [200, "Description should be no more than 200 characters"],
  },
  durationValue: {
    type: Number,
    required: [true, "Please enter the duration of the experience"],
  },
  durationUnit: {
    type: String,
    enum: ["months", "years", "none"],
    required: [true, "Please enter the duration unit"],
    default: "none",
  },
});

exprienceSchema.virtual("totalDurationInMonths").get(function () {
  let totalMonths = 0;
  if (this.durationUnit === "years") {
    totalMonths += this.durationValue * 12;
  } else if (this.durationUnit === "months") {
    totalMonths += this.durationValue;
  }
  return totalMonths;
});

export default exprienceSchema;
