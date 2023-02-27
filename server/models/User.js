import mongoose from "mongoose";
import validator from "validator";
import Role from "./Role.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 2,
    max: 30,
  },
  fatherName: {
    type: String,
    min: 2,
    max: 30,
  },
  grandFatherName: {
    type: String,
    min: 2,
    max: 30,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter valid email"],
    min: 2,
    max: 50,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minLength: [7, "You password should be at least 7 character"],
    select: false,
  },
  resetPasswordCode: {
    type: String,
    default: "",
  },
  resetPasswordCodeExpiration: {
    type: Date,
    default: null,
  },

  phoneNumber: {
    type: String,
    max: 15,
    min: 8,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: "",
  },
  verificationTokenExpiration: {
    type: Date,
    default: null,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Role,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
