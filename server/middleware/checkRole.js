const checkRole = (roles) => (req, res, next) => {
  const userRole = req.user.role; // Assuming you have added the authenticated user's information to the request object, such as through a previous authentication middleware

  if (roles.includes(userRole)) {
    return next();
  } else {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
};

export default checkRole;
