import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Set up authentication routes with "/api/auth" as the base URL
app.use("/api/auth", authRoutes);

// Start the server and establish database connection
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
