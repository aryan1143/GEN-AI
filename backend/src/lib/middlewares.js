import { config } from "dotenv";
import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/blacklistToken.model.js";
config();

/**
 * @name protectRoute
 * @desc Middleware to protect routes, checks for the presence of a valid JWT token in the cookies
 * and verifies it. If valid, attaches the user information to the response object and calls next(),
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} - If the token is valid, calls next() to proceed to the next middleware or route handler. If the token is missing or invalid, returns a 401 Unauthorized response with an appropriate message.
 */
export const protectRoute = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isBlacklistedToken = await BlacklistedToken.findOne({ token });
    if (isBlacklistedToken)
      return res.status(401).json({ message: "Unauthorized token" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token provided" });
  }
};
