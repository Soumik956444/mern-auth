import jwt from "jsonwebtoken";

// Middleware function to authenticate user based on JWT token in cookies
const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    // If no token is found, return an unauthorized response
    if (!token){
        return res.json({success: false, message: 'Not Authorized. Login Again'})
    }

    // Verify the token and extract user information
    try {

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecoded.id){
            req.body = req.body || {};
            req.body.userId = tokenDecoded.id
        }else{
            return res.json({success: false, message: 'Not Authorized. Login Again'});
        }

        next();


    } catch (error) {
        res.json({success: false, message: error.message});
    }

}

export default userAuth;











