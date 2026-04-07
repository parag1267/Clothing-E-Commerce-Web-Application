const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },

    size: {
        type: String
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1
    },

    price: {
        type: Number
    }
},{_id: false});


const cartSchema = new  mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [cartItemSchema]
},{timestamps: true});

const cartModel = mongoose.model("Cart",cartSchema);

module.exports = cartModel;