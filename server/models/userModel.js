// models/userModel.js — Mongoose schema/model for application users
// Stores hashed password, OTPs + expirations, account verification flag, and refresh tokens
import mongoose from "mongoose";

// Define the user schema for MongoDB using Mongoose
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''}, 
    verifyOtpExpireAt: {type: Number, default: 0}, 
    isAccountVerified: {type: Boolean, default: false}, 
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
    refreshToken: {type: String, default: ''},
    refreshTokenExpireAt: {type: Number, default: 0},

});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;