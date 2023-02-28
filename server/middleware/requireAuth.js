import jwt from "jsonwebtoken";
import User from "../models/User.js";

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    // Check if the token is valid
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token",
        });
      } else {
        // Find the user associated with the decoded token
        const user = await User.findById(decodedToken._id);
        if (!user) {
          res.status(401).json({
            success: false,
            message: "Unauthorized: User not found",
          });
        } else {
          console.log(decodedToken, "or h");
          // Add the user to the request object for future middleware to access
          req.user = user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Authorization header not found",
    });
  }
};

export default requireAuth;
