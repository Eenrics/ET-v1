// logout controller
const logoutUser = async (req, res) => {
  // Set the JWT cookie to an empty string and set the expiration date to the past
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};

export default logoutUser;
