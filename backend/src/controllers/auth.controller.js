import generateToken, { FLUXCHAT_COOKIE } from "../lib/utils.js";
import logger from "../lib/logger.js";
import User from "../models/user.model.js";

import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  logger.debug("--User signing up");

  const { email, fullName, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      logger.warn("Missing required fields");
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
      logger.warn("Email already exists");
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

    // Save user to the database
    await newUser.save();

    if (newUser) {
      // Generate JWT token and send user back to client
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

export const login = async (req, res) => {
  logger.debug("--User logging in");

  const { email, password } = req.body;
  try {
    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("Invalid email");
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      logger.error("Invalid password");
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token and send user back to client
    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    logger.error(`Error in login controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  logger.debug("--User logging out");

  try {
    // Remove cookie
    res.cookie(FLUXCHAT_COOKIE, "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error in logout controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  logger.debug("--User logging out");

  try {
    // Remove cookie
    res.cookie(FLUXCHAT_COOKIE, "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error in logout controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
