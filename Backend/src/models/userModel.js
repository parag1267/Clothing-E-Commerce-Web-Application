const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    mobileNo: {
        type: String,
        required: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, "Invalid phone number"]
    },

    profileImage: {
        url: String,
        public_id: String
    },

    role: {
        type: String,
        enum: ["user","admin"],
        default: "user"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null
    },

    refreshToken: {
        type: String,
        select: false
    }
},{
    timestamps: true,
    versionKey: false
})

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;