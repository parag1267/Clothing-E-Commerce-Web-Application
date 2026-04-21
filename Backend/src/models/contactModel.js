const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address (example@gmail.com)',
        ],
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Phone number is required'],
        match: [
            /^[6-9]\d{9}$/,
            'Please enter a valid 10-digit Indian mobile number',
        ],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    readAt: { 
        type: Date, 
        default: null 
    },   
    readBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    } 
}, { timestamps: true })


const contactModel = mongoose.model("contact", contactSchema);

module.exports = contactModel