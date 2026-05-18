// import necessary modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'

import dotenv from 'dotenv'
// import { use } from 'react';
dotenv.config()

// register user
export const register = async (req, res)=>{
    const {name, email, password} = req.body;

    // check if all details are provided
    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        // check if user already exists
        const existingUser = await userModel.findOne({email})

        // if user already exists, return error message
        if(existingUser){
            return res.json({ success: false, message: "User already exists" });
        }
        // password encryption
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const user = new userModel({name, email, password: hashedPassword});

        // sotring users in mongoDB database
        await user.save(); 

        // generate JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending welcome E-Mail to the user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Neotort Engineering Hub',
            text: `Welcome to Neotort Engineering Hub. Your account has been created with email id: ${email} and password: ${password}. Please keep this information safe.`
        }


        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    // return success message
    } catch (error){
        res.json({success: false, message: error.message})
    }

}


// login user
export const login = async (req, res)=>{
    const {email, password} = req.body;

    // check if all details are provided
    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required'})

    }

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'Invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: 'Invalid password'})
        }
         // generate JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true});

    } catch(error){
        return res.json({ success: false, message: error.message});
    }

}



// logout user
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:
                process.env.NODE_ENV === 'production'
                    ? 'none'
                    : 'strict',
        });

        return res.json({
            success: true,
            message: "Logged Out Successfully",
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};






// sending email verification OTP
export const sendVerifyotp = async (req, res) => {
    try{

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.verifyotp === '' || user.verifyotp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.verifyotpExpireAt < Date.now()){
            return res.json({success: false, message:'OTP Expired'});
        }

        const {userId} = req.body;

        const user = await userModel.findById(userId); 

        if(user.isAccountVerified){
            return res.json({success: false, message: 'Account is already Verified'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.sendVerifyotp = otp;
        user.verifyotpExporeAt = Date.now() + 10 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Neotort Engineering Hub - Email Verification OTP',
            text: `Your verification OTP is: ${otp}. Verify Your Acciunt Using This OTP. This is Valid for 24 Hours.`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: 'OTP Sent to Your E-Mail'})

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.json({success: false, message: 'Missing Details'});
    }
    try {
        
    }catch (error) {
        res.json({success: false, message: error.message});
    }
}