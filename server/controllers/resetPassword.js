import User from "../models/User.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.resetPasswordCode !== code) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid reset code" });
    }

    await User.resetPassword(email, code, newPassword);

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default resetPassword;
