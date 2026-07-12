// controllers/authController.js — handles authentication related operations
// - register, login, logout
// - email verification (send/verify OTP), password reset (send/reset OTP)
// - refresh tokens and resend OTP

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'
import dotenv from 'dotenv'
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

        // generate a verification OTP so the user can verify their email
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

        // generate tokens (kept consistent with the login flow)
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        const newRefreshToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

        // sotring users in mongoDB database
        await user.save();

        // set token cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // Sending welcome + verification E-Mail to the user (never email passwords)
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Neotort Engineering Hub',
            text: `Welcome to Neotort Engineering Hub, ${name}! Your account has been created with email id: ${email}. Your email verification OTP is: ${otp} (valid for 10 minutes).`
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

        if(!user.isAccountVerified){
            return res.json({success: false, message: 'Account not verified. Please verify your email first.'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        const newRefreshToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true});

    } catch(error){
        return res.json({ success: false, message: error.message});
    }


}


// logout user
export const logout = async (req, res) => {
    try {
        const storedRefreshToken = req.cookies.refreshToken;

        if (storedRefreshToken) {
            try {
                const tokenDecoded = jwt.verify(storedRefreshToken, process.env.JWT_SECRET);
                const user = await userModel.findById(tokenDecoded.id);
                if (user) {
                    user.refreshToken = '';
                    user.refreshTokenExpireAt = 0;
                    await user.save();
                }
            } catch (_) {
                // token invalid or expired, still clear cookies
            }
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged Out Successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// sending email verification OTP
export const sendVerifyotp = async (req, res) => {
    try{
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.isAccountVerified){
            return res.json({success: false, message: 'Account is already Verified'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Neotort Engineering Hub - Email Verification OTP',
            text: `Your verification OTP is: ${otp}. Verify your account using this OTP. Valid for 10 minutes.`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: 'OTP Sent to Your E-Mail'})

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// verifying email using OTP
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.json({success: false, message: 'Missing Details'});
    }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP is Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        const newRefreshToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, message: 'Account is Verified Successfully'});

    }catch (error) {
        res.json({success: false, message: error.message});
    }
}


// refresh token
export const refreshToken = async (req, res) => {
    const storedRefreshToken = req.cookies.refreshToken;

    if (!storedRefreshToken) {
        return res.json({ success: false, message: 'No refresh token. Login Again' });
    }

    try {
        const tokenDecoded = jwt.verify(storedRefreshToken, process.env.JWT_SECRET);

        const user = await userModel.findById(tokenDecoded.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found. Login Again' });
        }

        if (user.refreshToken !== storedRefreshToken) {
            return res.json({ success: false, message: 'Invalid refresh token. Login Again' });
        }

        if (user.refreshTokenExpireAt < Date.now()) {
            return res.json({ success: false, message: 'Refresh token expired. Login Again' });
        }

        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        await user.save();

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Token Refreshed' });

    } catch (error) {
        return res.json({ success: false, message: 'Invalid or Expired Refresh Token. Login Again' });
    }
}


// resend verification OTP
export const resendOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account is already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Neotort Engineering Hub - Resend Verification OTP',
            text: `Your new verification OTP is: ${otp}. Valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP Resent to Your E-Mail' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Check if user is authenticated 
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true, message: 'User is authenticated'});
    }catch (error) {
        res.json({success: false, message: error.message});
    }
}


// send password reset OTP
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: 'Email is required'});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }


        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Neotort Engineering Hub - Password Reset OTP',
            text: `Your password reset OTP is: ${otp}. Reset your password using this OTP. Valid for 10 minutes.`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success: true, message: 'Password Reset OTP Sent to Your E-Mail'});



    }catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Reset Password using OTP.
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword) {
        return res.json({success: false, message: 'Email, OTP and New Password are required'});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'User Not Found'});
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success: false, message: 'Invalid Otp'});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'});
        }

        // new Password encryption
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // new password saving in database
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: 'Password Reset Successfully'});

    }catch (error){
        return res.json({success: false, message: error.message});
    }
}



