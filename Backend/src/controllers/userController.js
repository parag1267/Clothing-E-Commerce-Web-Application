const USER_MODEL = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { deleteImage, uploadImage } = require('../utils/cloudinaryUpload');

const isValidEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}

const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

const isValidMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile);
};

const signup = async (req,res) => {
    try {
        const {fullname,email,password,confirmPassword,mobileNo} = req.body;

        if(!fullname || !email || !password || !confirmPassword || !mobileNo){
            return res.status(400).json({
                success: false,
                message: "All field are required"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }

        if(!isValidEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            })
        }

        if(!isStrongPassword(password)){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
            })
        }

        if(!isValidMobile(mobileNo)){
            return res.status(400).json({
                success: false,
                message: "Mobile number must be 10 digits and valid"
            })
        }

        const existsUser = await USER_MODEL.findOne({email});

        if(existsUser){
            return res.status(400).json({
                success: false,
                message: "Email address already exist"
            });
        }

        const existsMobile = await USER_MODEL.findOne({mobileNo});

        if(existsMobile){
            return res.status(400).json({
                success: false,
                message: "Mobile number already exist"
            });
        }


        const hashPassword = await bcrypt.hash(password,11);

        const user = await USER_MODEL.create({
            fullname,
            email,
            password: hashPassword,
            mobileNo
        });

        const userObject = user.toObject();
        delete userObject.password;

        res.status(201).json({
            success: true,
            message: "Registeration successfully",
            user: userObject
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const signin = async (req,res) => {
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All field are required"
            })
        }

        if(!isValidEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            })
        }

        const user = await USER_MODEL.findOne({email}).select("+password +refreshToken");
        
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                success: false,
                message: "Your account is blcoked. Please contact admin"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const accessToken = jwt.sign(
            {id: user._id, role: user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "1d"}
        )

        const refreshToken = jwt.sign(
            {id: user._id, role: user.role},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}
        )

        const hashedToken = await bcrypt.hash(refreshToken,11);
        user.refreshToken = hashedToken;
        user.lastLogin = new Date();
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.refreshToken;

        res
            .cookie("accessToken",accessToken,{
                httpOnly: true,
                secure: false
            })
            .cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: false
            })
            .status(200).json({
            success: true,
            message: "Login successfully",
            user: userObject,
            accessToken: accessToken
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}   

const logout = async (req,res) => {
    try {
        const token = req.cookies.refreshToken;

        if(token){
            const decoded = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
            await USER_MODEL.updateOne({_id: decoded.id},{
            $unset: {refreshToken: 1}
        })
        }

        const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        }

        res
            .clearCookie("accessToken",cookieOptions)
            .clearCookie("refreshToken",cookieOptions)
            .status(200)
            .json({
                success: true,
                user: null,
                message: "Logout successfully"
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const profile = async (req,res) => {
    try {
        const user = await USER_MODEL.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            message: "profile fetched successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateProfile = async (req,res) => {
    try {
        const user = await USER_MODEL.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const {fullname,mobileNo} = req.body;

        if(fullname) user.fullname = fullname;
        if(mobileNo) user.mobileNo = mobileNo;

        if(req.file){
            if(user.profileImage?.public_id){
                await deleteImage(user.profileImage.public_id)
            }
            
            const result = await uploadImage(req.file.buffer,"users");

            user.profileImage = {
                url: result.url,
                public_id: result.public_id
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

const refreshToken = async (req,res) => {
    try {
        const token = req.cookies.refreshToken;

        if(!token){
            return res.status(401).json({
                success: false,
                user: null,
                message: "No refresh token"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await USER_MODEL.findById(decoded.id).select("+refreshToken");

        if(!user){
            return res.status(401).json({
                success: false,
                user: null,
                message: "User not found"
            });
        }

        const isValid = await bcrypt.compare(token,user.refreshToken);

        if(!isValid){
            return res.status(401).json({
                success: false,
                user: null,
                message: "Invalid Token"
            });
        }

        const newAccessToken = jwt.sign(
            {id: user._id, role: user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

        res.status(200).json({
            success: true,
            message: "Access genrate successfully",
            accessToken: newAccessToken
        })
    } catch (error) {
        return res.status(403).json({
            success: false,
            user: null,
            message: "Token expired"
        });
    }
}

module.exports = {
    signup,
    signin,
    logout,
    profile,
    updateProfile,
    refreshToken
}