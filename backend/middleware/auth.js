import { verifyAccess } from "../utils/token.js";

export default function auth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const data = verifyAccess(token);
    req.user = { userId: data.userId };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
