import jwt from "jsonwebtoken";
import User from "../models/User.js";

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if the token exists and is valid
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token",
        });
      } else {
        // Find the user associated with the decoded token
        const user = await User.findById(decodedToken.id);
        if (!user) {
          res.status(401).json({
            success: false,
            message: "Unauthorized: User not found",
          });
        } else {
          // Add the user to the request object for future middleware to access
          req.user = user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Token not found",
    });
  }
};

export default requireAuth;
