import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

/**
 * @name generateJWT
 * @desc Utility function to generate a JWT token for a user, takes the user object as input and returns a signed JWT token with the user's id, username, and email as the payload. The token is signed using a secret key from the environment variables and has an expiration time of 1 day.
 * @param {*} user - The user object for which to generate a JWT token
 * @returns {string} - The generated JWT token
 */
export function generateJWT(user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
}
