import User from "../../models/User.js";

const verifyEmail = async (req, res) => {
  const token = req.query.token;

  try {
    // Find user with matching verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token.",
      });
    }

    // Set user as verified
    user.isEmailVerified = true;
    user.verificationToken = "";
    user.verificationTokenExpiration = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying account.",
    });
  }
};

export default verifyEmail;
