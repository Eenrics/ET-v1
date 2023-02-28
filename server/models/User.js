import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import UserProfile from "./UserProfile.js";

const userSchema = new mongoose.Schema(
  {
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
      type: Number,
      default: 0,
    },
    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  },
  { timestamps: true }
);

// userSchema methods to register user
userSchema.statics.register = async function (email, password, phoneNumber) {
  // check if email password and phone number are provided
  if (!email || !password || !phoneNumber) {
    throw new Error("Please provide email, password and phone number");
  }

  // check if user already exists with email or phone number
  const exist = await this.findOne().or([{ email }, { phoneNumber }]);
  if (exist) {
    if (exist.email === email) {
      throw new Error("An account with this email already exists");
    } else {
      throw new Error("An account with this phone number already exists");
    }
  }

  // check if email is valid using validator
  if (!validator.isEmail(email)) {
    throw new Error("Please provide a valid email");
  }
  // check if phone number is valid using validator
  if (!validator.isMobilePhone(phoneNumber)) {
    throw new Error("Please provide a valid phone number");
  }

  // check if password is strong password
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should be at least 8 characters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
    );
  }

  // create salt for password
  const salt = await bcrypt.genSalt(10);
  // hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  // create new user
  const user = await this.create({
    email,
    password: hashedPassword,
    phoneNumber,
  });

  // return user
  return user;
};

// login user
userSchema.statics.login = async function (identifier, password) {
  if (!identifier || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne()
    .or([{ email: identifier }, { phoneNumber: identifier }])
    .select("+password");
  if (!user) {
    throw Error(
      "There is no account with this email or phone number. Please register now"
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return user;
};

userSchema.statics.forgotPassword = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const code = crypto.randomInt(100000, 999999).toString();
  user.resetPasswordCode = code;
  user.resetPasswordCodeExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  return code;
};

userSchema.statics.resetPassword = async function (email, code, newPassword) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.resetPasswordCode !== code) {
    throw new Error("Invalid code");
  }

  if (user.resetPasswordCodeExpiration < Date.now()) {
    throw new Error("Code expired");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "Password should be at least 8 characters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
    );
  }

  //   then we will set up salt with 10 digit so that it will be balanced for security and speed and also we will use asyn await because it takes time
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  user.password = hash;
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpiration = undefined;

  await user.save();
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
