const ORDER_MODEL = require('../models/orderModel');
const PRODUCT_MODEL = require('../models/productModel');
const CART_MODEL = require('../models/cartModel');
const stripe = require('../config/stripe');

const createSession = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            })
        }
        const order = await ORDER_MODEL.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: order.items.map(item => ({
                price_data: {
                    currency: "inr",
                    product_data: { name: item.name },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`
        })

        res.status(200).json({
            success: true,
            message: "Session Created successfully",
            url: session.url,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { orderId, session_id } = req.body;

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment Failed"
            })
        }

        const order = await ORDER_MODEL.findById(orderId);

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            })
        }

        if (order.paymentInfo.status === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified"
            })
        }

        for (const item of order.items) {
            const product = await PRODUCT_MODEL.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                })
            }

            const sizeObj = product.sizes.find(s => s.size === item.size)

            if (!sizeObj) {
                return res.status(404).json({
                    success: false,
                    message: `Size ${item.size} not found for ${product.name}`
                })
            }

            sizeObj.stock -= item.quantity

            product.stock = product.sizes.reduce(
                (t, s) => t + s.stock,
                0
            );
            await product.save({ validateBeforeSave: false });
        }


        order.paymentInfo.status = "paid";
        order.paymentInfo.id = session.payment_intent;
        order.orderStatus = "processing";
        await order.save();

        await CART_MODEL.findOneAndUpdate(
            { user: req.user.id },
            { items: [] }
        )

        res.status(200).json({
            success: true,
            message: "Order Confirmed & Cart Cleared",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    createSession,
    verifyPayment
}