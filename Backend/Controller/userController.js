import mongoose from "mongoose";
import User from "../Model/userModel.js";
import nodemailer from "nodemailer";
//import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Use environment variable for email user
    pass: process.env.EMAIL_PASS,  // Use environment variable for email password
  },
});

export const loginmodel = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ Status: "Failed", message: "User not found" });
    }
    // Compare password
    //const isMatch = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res.status(400).json({ Status: "Failed", message: "Invalid credentials" });
    }
    res.status(200).json({
      Status: "Success",
      message: "Login successful",
      user, // optionally return user data
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ Status: "Failed", message: error.message || "Something went wrong" });
  }
};


export const registrationmodel = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ Status: "Failed", message: "Email already exists" });
    }
    // Check if phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ Status: "Failed", message: "Phone number already exists" });
    }
    // Hash the password
    //const saltRounds = 10;
    //const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create and save the new user with hashed password
    const newUser = new User({ name, email, phone, password: password });
    await newUser.save();
    res.status(200).json({ Status: "Success", message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ Status: "Failed", message: "Something went wrong" });
  }
};
  
export const getUser =   async (req, res) => {
  try {
    const users = await User.find(); // Find all users in the database
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email phone'); // <--- Ensure these fields are selected
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update user' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ Status: "Failed", message: "User not found" });

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Your Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #2a5298;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please use the code below to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; color: #1e3c72; background: #eef3fc; padding: 15px; text-align: center; border-radius: 5px; letter-spacing: 3px;">
            ${resetCode}
          </div>
          <p style="margin-top: 20px;">This code is valid for 15 minutes. If you did not request a password reset, please ignore this email or contact our support.</p>
          <p>Thank you,<br/>Team MangloreStores</p>
        </div>
      `,
    });
    
    res.status(200).json({ Status: "Success", message: "Reset code sent to email" });
  } catch (err) {
    res.status(500).json({ Status: "Failed", message: err.message });
  }
};


export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== resetCode ||
      new Date() > user.resetCodeExpiry
    ) {
      return res.status(400).json({
        Status: "Failed",
        message: "Invalid or expired reset code",
      });
    }

    //const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.status(200).json({
      Status: "Success",
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ Status: "Failed", message: err.message });
  }
};



