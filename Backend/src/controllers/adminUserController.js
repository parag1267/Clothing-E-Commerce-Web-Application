const USER_MODEL = require('../models/userModel');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);


        const query = {
            isDeleted: false,
        };

        if(search){
            query.$or = [
                { fullname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }

        const users = await USER_MODEL.find(query)
            .select("-password -refreshToken")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await USER_MODEL.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum)

        res.status(200).json({
            success: true,
            total,
            totalPages,
            page: pageNum,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await USER_MODEL.findById(req.params.id)
            .select("-password -refreshToken");

        if(!user || user.isDeleted){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Fetch user successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const createUser = async (req,res) => {
    try {
        const {fullname,email,password,confirmPassword,mobileNo,role} = req.body;

        if(!fullname || !email || !password || !confirmPassword || !mobileNo || !role){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            })
        }

        const existingEmail = await USER_MODEL.findOne({email});
        if(existingEmail){
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const existingMobile = await USER_MODEL.findOne({mobileNo});
        if(existingMobile){
            return res.status(400).json({
                success: false,
                message: "Mobile Number already exists"
            })
        }

        let finalRole = "user";

        if(req.user.role === "admin" && role === "admin"){
            finalRole = "admin";
        }

        const hashPassword = await bcrypt.hash(password,11);

        const newUser = await USER_MODEL.create({
            fullname,
            email,
            password: hashPassword,
            mobileNo,
            role: finalRole,
            createdBy: req.user.id
        })

        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            message: "User Created successfully",
            user: userObj
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const toggleUserStatus = async (req, res) => {
    try {
        const userId = req.params.id
        if (userId === req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot block your own account"
            })
        }

        const user = await USER_MODEL.findById(userId);

        if (!user || user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.role === "admin" && user.isActive) {
            const activeAdminCount = await USER_MODEL.countDocuments({
                role: 'admin',
                isActive: true,
                isDeleted: false
            });

            if (activeAdminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot block the last active admin"
                })
            }
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: true,
            message: `User ${user.isActive ? "unblocked" : "blocked"} successfully`,
            user: {
                _id: user.id,
                isActive: user.isActive
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}


const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId === req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete your own account"
            })
        }

        const user = await USER_MODEL.findById(userId);

        if (!user || user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted"
            })
        }

        if (user.role === 'admin') {
            const adminCount = await USER_MODEL.countDocuments({
                role: 'admin',
                isDeleted: false
            });

            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot delete last admin"
                })
            }
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}


module.exports = {
    getAllUsers,
    getUser,
    createUser,
    toggleUserStatus,
    deleteUser
}
