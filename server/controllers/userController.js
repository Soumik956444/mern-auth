import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(!user){
            res.json({success: false, message: 'User Not Found', data: user})
        }

        res.json({success: true, message: 'User Data Fetched Successfully', data: user});

    }catch (error) {
        res.json({success: false, message: error.message});
    }
}