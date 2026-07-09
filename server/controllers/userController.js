import userModel from "../models/userModel.js";
// get user data
export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;
        
        const user = await userModel.findById(userId);

        if(!user){
            res.json({success: false, message: 'User Not Found', data: user})
        }
        // send only required data to frontend
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        });
        // we can also send email and other data if needed, but for now we are sending only name and isAccountVerified
    }catch (error) {
        res.json({success: false, message: error.message});
    }
}


