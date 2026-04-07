const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    slug: {
        type: String,
        unique: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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
},{
    timestamps: true
})

const subCategoryModel = mongoose.model("SubCategory",subCategorySchema);
module.exports = subCategoryModel;