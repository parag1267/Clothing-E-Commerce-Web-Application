const CONTACT_MODEL = require('../models/contactModel');

const createMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const newContact = await CONTACT_MODEL.create({
            name,
            email,
            phone,
            message
        })

        return res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            data: newContact
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((e) => e.message)
            return res.status(400).json({
                success: false,
                message: validationErrors[0],
            })
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getMessage = async (req, res) => {
    try {
        const contactMessage = await CONTACT_MODEL.find({ status: 'unread' }).sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            message: "Unread messages fetched successfully",
            count: contactMessage.length,
            data: contactMessage
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllMessage = async (req, res) => {
    try {
        const contactMessage = await CONTACT_MODEL.find().sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            message: "Fetch Contact message successfully",
            count: contactMessage.length,
            data: contactMessage
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Message ID is required"
            })
        }

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID format",
            });
        }

        const existingMessage = await CONTACT_MODEL.findById(id);

        if (!existingMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            })
        }

        if (existingMessage.status === 'read') {
            return res.status(200).json({
                success: true,
                message: "Message is already marked as read",
                data: existingMessage
            })
        }

        const updatedMessage = await CONTACT_MODEL.findByIdAndUpdate(
            id,
            {
                status: 'read',
                readAt: new Date(),
                readBy: req.user?._id || null
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Message marked as read successfully",
            data: updatedMessage,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    createMessage,
    getMessage,
    getAllMessage,
    markAsRead
}