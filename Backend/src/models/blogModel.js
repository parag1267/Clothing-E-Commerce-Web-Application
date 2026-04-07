const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        unique: true
    },

    content: {
        type: String,
        required: true
    },

    author: {
        type: String,
        default: "Admin"
    },

    coverImage: {
        url: String,
        public_id: String
    },

    tags: [String],

    isFeatured: {
        type: Boolean,
        default: false
    },

    isPublished: {
        type: Boolean,
        default: true
    },

    isActive: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

const blogModel = mongoose.model("blog",blogSchema);

module.exports = blogModel;