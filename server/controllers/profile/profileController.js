import User from "../../models/User.js";
import UserProfile from "../../models/UserProfile.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("userProfile");
    if (!user) {
      throw Error("User not found");
    }
    res.status(200).json({
      success: true,
      data: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        userProfile: user.userProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { userData } = req.body;
  const userId = req.user._id;

  try {
    // Find the user by ID and update their user data
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const { userProfileData } = req.body;
  const userId = req.user._id;

  try {
    // Find the userProfile for the user and update it
    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: userProfileData },

      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("user");

    res.json({ userProfile: updatedUserProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
