import User from "../models/User.js";
import createToken from "../utils/CreateToken.js";

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.login(identifier, password);
    if (!user) {
      throw Error("Couldn't sign in");
    }
    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

export default loginUser;
