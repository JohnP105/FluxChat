import generateToken from "../lib/utils.js";
import logger from "../lib/logger.js";
import User from "../models/user.model.js";

import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  logger.debug("--User signing up");

  try {
    if (!fullName || !email || !password) {
      logger.warn("⚠️ Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent passwords with less than 6 characters
    if (password.length < 6) {
      logger.error("Password must be at least 6 characters");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Prevent duplicate emails
    const user = await User.findOne({ email });
    if (user) {
      logger.warn("⚠️ Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token
      generateToken(newUser._id, res);
      logger.success("User registered successfully");

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      logger.error("Invalid user data");
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    logger.error(`Error in signup controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = (req, res) => {
  logger.debug("--User logging in");
  res.send("login route");
};

export const logout = (req, res) => {
  logger.debug("--User logging out");
  res.send("logout route");
};
