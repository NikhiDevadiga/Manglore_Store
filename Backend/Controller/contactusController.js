import mongoose from "mongoose";
import Contact from "../Model/contactusModel.js"

export const submitMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: "Message received" });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllMessages = async (req, res) => {
    try {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.json({ data: messages });
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};


export const deleteMesseges = async (req, res) => {
    try {
      const deletedMessage = await Contact.findByIdAndDelete(req.params.id);
      if (!deletedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };


  
