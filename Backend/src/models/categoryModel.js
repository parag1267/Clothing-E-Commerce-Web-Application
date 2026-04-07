const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        maxlength: 100,
        required: true
    },

    slug: {
        type: String,
        unique: true,
    },

    description: {
        type: String,
        trim: true,
        maxlength: 400,
        required: true
    },

    images: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;