const jwt = require('jsonwebtoken');
const USER_MODEL = require('../models/userModel');
const { refreshToken } = require('../controllers/userController');
const bcrypt = require('bcrypt');

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token"
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await USER_MODEL.findById(decoded.id)
            .select("_id role isActive")

        if (!user || !user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account blocked. Account denied"
            })
        }

        req.user = {
            id: user._id,
            role: user.role
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            user: null,
            message: error.message || "Invalid token"
        })
    }
}


module.exports = isAuth;