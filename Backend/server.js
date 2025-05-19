import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import SubCatRouter from "./Router/subcategoryRouter.js";
import ProductRouter from "./Router/productRouter.js";
import CatRouter from "./Router/categoryRouter.js";
import UserRouter from "./Router/userRouter.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ContactusRouter from "./Router/contactusRouter.js";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

// Setup Express app
const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define port
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "https://manglore-store-t98r.onrender.com", // production
  "http://localhost:5173"                // local dev
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Enable parsing of JSON bodies
app.use(express.json());

// API Routes
app.use("/api", CatRouter);
app.use("/api", ProductRouter);
app.use("/api", SubCatRouter);
app.use("/api", UserRouter);
app.use("/api", ContactusRouter);

// Static folder for images
app.use('/Backend/Images', express.static(path.join(__dirname, 'Images')));

// Start the server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);

});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Example mail options (can be moved to a route later)
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'recipient@example.com',
  subject: 'Test Email from Nodemailer',
  text: 'Hello, this is a test email!',
};

// Send test email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});

// Verify mail transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying transporter:', error);
  } else {
    console.log('Nodemailer is ready for use');
  }
});
