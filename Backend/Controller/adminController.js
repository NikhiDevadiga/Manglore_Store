import mongoose from "mongoose";
import User from "../Model/adminModel.js"


export const adminlogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  // Validate and respond (use bcrypt & real admin in prod)
  if (username === 'admin' && password === 'admin123') {
    return res.json({ token: 'admin_token_here', user: { username } });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

// export const adminregistration =(async (req, res) => {
//     try {
//         const newuser = new User(req.body)
//         await newuser.save()
//         res.send("Registration Successful")
//     } catch (error) {
//         res.status(400).json(error)
//     }
// })
