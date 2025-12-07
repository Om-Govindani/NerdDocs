import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expired" });
  }
}
