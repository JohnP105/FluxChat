import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json()); // parse incoming JSON requests
app.use(cookieParser()); // parse cookies

// Routes
app.use("/api/auth", authRoutes);

// Start the server and establish database connection
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
