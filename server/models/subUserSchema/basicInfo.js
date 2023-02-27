import mongoose from "mongoose";

const basicInfoSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  // emergencyContact
  emergencyContact: {
    type: String,
    // name and phone number
    default: null,
    name: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
  },
  // basi assement exam pass or not
  basicAssessmentExam: {
    type: Boolean,
    default: false,
  },
  // short description or bio
  bio: {
    type: String,
    default: null,
  },

  birthDate: {
    type: Date,
    default: null,
  },
  cv: {
    type: String,
    default: null,
  },
  resume: {
    type: String,
    default: null,
  },
  profilePicture: {
    type: String,
    default: function () {
      if (this.gender === "male") {
        return "default-male-avatar.png";
      } else if (this.gender === "female") {
        return "default-female-avatar.png";
      } else {
        return "default-avatar.png";
      }
    },
  },
});

export default basicInfoSchema;
