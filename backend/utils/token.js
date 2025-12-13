import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export function signAccess(payload, opts = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || "15m" });
}
export function signRefresh(payload, opts = {}) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: opts.expiresIn || "30d" });
}
export function verifyAccess(token) {
  return jwt.verify(token, JWT_SECRET);
}
export function verifyRefresh(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
