import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import categoryRoutes from './routes/categoryRoutes.js';
import jobPostRoutes from './routes/jobpostRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import applicationRoutes from './routes/applicationRoutes.js';
import subscribeRoute from './routes/subscribeRoute.js';
import blogRoutes from './routes/blogRoutes.js';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { verifyAndRefreshToken } from './config/auth.js';
import chatsRoutes from './routes/chatsRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Enable trust proxy for Render / Vercel cloud reverse proxies so HTTPS cookies work
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static directories
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost")
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback for flexible deployments
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true 
}));

connectDB();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: "Job Search API Platform Running" });
});

// DB Connection Guard Middleware
app.use((req, res, next) => {
  if (req.path === '/api/health' || req.path === '/') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection is re-establishing. Please try again in a few seconds.",
    });
  }
  next();
});

// Refresh token route
app.get("/api/refresh", verifyAndRefreshToken, (req, res) => {
  res.status(200).json({ message: "Session refreshed successfully", success: true, user: req.user });
});

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/jobposts', jobPostRoutes);
app.use("/api/auth", userRoutes); 
app.use("/api/application", applicationRoutes);
app.use("/api", subscribeRoute);
app.use("/api/blogs", blogRoutes);
app.use("/api/chat", chatsRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
