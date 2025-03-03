import jwt from "jsonwebtoken";
import logger from "../lib/logger.js";
import User from "../models/user.model.js";
import { FLUXCHAT_COOKIE } from "../lib/utils.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Grab the token from the cookie
    const token = req.cookies[FLUXCHAT_COOKIE];
    if (!token) {
      logger.warn("Unauthorized - No Token Provided");
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      logger.warn("Unauthorized - Invalid Token");
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find the user (await needed)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Add user to request and proceed
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Error in middleware protectRoute: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
