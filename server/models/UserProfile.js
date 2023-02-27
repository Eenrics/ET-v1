import mongoose from "mongoose";
import User from "./User.js";
import exprienceSchema from "./subUserSchema/exprience.js";
import educationSchema from "./subUserSchema/education.js";
import languagePairSchema from "./subUserSchema/languagepair.js";
import languagesSchema from "./subUserSchema/languages.js";
import bankAccountSchema from "./subUserSchema/bankAccount.js";
import basicInfoSchema from "./subUserSchema/basicInfo.js";
import AddressSchema from "./subUserSchema/AddresSchema.js";
import employmentifnoSchema from "./subUserSchema/employmentifno.js";

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // basicInfo:
  basicInfo: basicInfoSchema,
  // exprience:
  exprience: [exprienceSchema],
  // education:
  education: [educationSchema],
  // languagePair:
  languagePair: [languagePairSchema],
  // languages:
  languages: [languagesSchema],
  // bankAccount:
  bankAccount: bankAccountSchema,
  // address:
  address: AddressSchema,
  // employmentifno:
  employmentifno: employmentifnoSchema,
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
