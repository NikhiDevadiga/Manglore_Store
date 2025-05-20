import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import SubCatRouter from "./Router/subcategoryRouter.js";
import ProductRouter from "./Router/productRouter.js";
import CatRouter from "./Router/categoryRouter.js";
import UserRouter from "./Router/userRouter.js";
import ContactusRouter from "./Router/contactusRouter.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define PORT
const PORT = process.env.PORT || 5000;

// Allowed CORS origins
const allowedOrigins = [
  "https://manglore-store-t98r.onrender.com", // production
  "http://localhost:5173"                     // local dev
];

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// JSON parser
app.use(express.json());

// Serve static image files
app.use('/Backend/Images', express.static(path.join(__dirname, 'Images')));

// API Routes
app.use("/api", CatRouter);
app.use("/api", ProductRouter);
app.use("/api", SubCatRouter);
app.use("/api", UserRouter);
app.use("/api", ContactusRouter);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter once on server start
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

// Start the server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
