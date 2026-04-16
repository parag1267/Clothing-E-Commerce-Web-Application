const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    name: String,

    size: {
        type: String,
        required: true
    },

    sku: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String
    }
},{_id: false});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    items: [orderItemSchema],

    totalAmount: {
        type: Number,
        required: true
    },

    shippingAddress: {
        fullname: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },

    paymentInfo: {
        id: String,
        method: String,
        status: {
            type: String,
            enum: ["pending","paid","failed"],
            default: "pending"
        }
    },

    orderStatus: {
        type: String,
        enum: ["processing","shipped","delivered","cancelled"],
        default: "processing"
    },

    deliveredAt: {
        type: Date
    },

    cancelledAt: {
        type: Date
    }
},{timestamps: true})


const orderModel = mongoose.model("Order",orderSchema);
module.exports = orderModel;