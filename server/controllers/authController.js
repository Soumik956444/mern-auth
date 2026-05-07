// import necessary modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// register user
export const register = async (req, res)=>{
    const {name, email, password} = req.body;

    // check if all details are provided
    if(!name || !email || !password){
        returnres,json({success: false, message: 'Missing Details'})
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