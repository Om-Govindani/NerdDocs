// backend/middleware/authOptional.js
import jwt from "jsonwebtoken";

export default function authOptional(req, res, next) {
  const token = req.cookies?.accessToken;

  // No token → treat as guest
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = { userId: decoded.userId };
  } catch (err) {
    // Invalid token → continue as guest
    req.user = null;
  }

  next();
}
