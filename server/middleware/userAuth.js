// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//     const token = req.cookies;

//     if (!token){
//         return res.json({success: false, message: 'Not Authorized. Login Again'})
//     }

//     try {

//         const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)

//         if(tokenDecode.id){
//             req.body.userId = tokenDecode.id
//         }else{
//             return res.json({success: false, message: 'Not Authorized. Login Again'});
//         }

//         next();


//     } catch (error) {
//         res.json({success: false, message: error.message});
//     }

// }

// export default userAuth;













import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({
                success: false,
                message: 'Token Missing'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;