import jwt from "jsonwebtoken";
import logger from "./logger.js";

/**
 * Generates a JWT token and stores it in a secure HTTP-only cookie.
 * @param {string} userId - The user's unique ID.
 * @param {object} res - The Express response object (to set cookies).
 * @returns {string} - The generated JWT token.
 */
const generateToken = (userId, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store the token in a secure HTTP-only cookie
    res.cookie("fluxchat_jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // Prevents XSS attacks (JavaScript can't access the cookie)
      sameSite: "strict", // Prevents CSRF attacks
      secure: process.env.NODE_ENV !== "development", // HTTPS only in production
    });

    // Log success message
    logger.info(`JWT generated for user: ${userId}`);

    return token;
  } catch (error) {
    logger.error(`Error generating JWT: ${error.message}`);
    throw new Error("Token generation failed");
  }
};

export default generateToken;
