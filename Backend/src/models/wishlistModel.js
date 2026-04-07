const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
        index: true
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }]
},{timestamps: true});

const WishlistSchema = mongoose.model("wishlist",wishlistSchema);

module.exports = WishlistSchema;