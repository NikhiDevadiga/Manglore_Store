import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {          // fixed name from userName → username to match frontend
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    resetCode: String,
    resetCodeExpiry: Date,
}, { 
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;

