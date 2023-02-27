import User from "../models/User.js";
import nodemailer from "nodemailer";

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const code = await User.forgotPassword(email);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Forgot Password",
      html: `Your verification code is ${code}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification code sent to email",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export default forgotPassword;
