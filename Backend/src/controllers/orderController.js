const { query } = require('express');
const ORDER_MODEL = require('../models/orderModel');
const PRODUCT_MODEL = require('../models/productModel');

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required"
            })
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address required"
            });
        }

        let totalAmount = 0;

        const updatedItems = [];

        for (const item of items) {
            if (!item.size) {
                return res.status(400).json({
                    success: false,
                    message: "Size is required"
                });
            }

            const product = await PRODUCT_MODEL.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                })
            }

            const sizeObj = product.sizes.find(s => s.size === item.size.toUpperCase())

            if (!sizeObj) {
                return res.status(404).json({
                    success: false,
                    message: `Size ${item.size} not available for ${product.name}`
                })
            }

            if (sizeObj.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name} (${item.size})`
                })
            }

            const price = product.discountPrice || product.price;
            totalAmount += price * item.quantity;

            updatedItems.push({
                product: product._id,
                name: product.name,
                size: item.size,
                sku: sizeObj.sku || product.sku,
                quantity: item.quantity,
                price,
                image: product.images?.[0]?.url || ""
            });
        }

        const order = await ORDER_MODEL.create({
            user: req.user.id,
            items: updatedItems,
            totalAmount,
            shippingAddress,
            paymentInfo: {
                method: "stripe",
                status: "pending"
            }
        });

        res.status(200).json({
            success: true,
            message: "Order successfully created",
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getMyOrder = async (req, res) => {
    try {
        const orders = await ORDER_MODEL.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getSavedAddresses = async (req,res) => {
    try {
        const orders = await ORDER_MODEL.find({user: req.user.id})
            .select("shippingAddress createdAt")
            .sort({createdAt: -1});

        if(!orders.length){
            return res.status(200).json({
                success: true,
                addresses: []
            })
        }

        const seen = new Set();
        const addresses = [];

        for(const order of orders){
            const addr = order.shippingAddress;
            const key = `${addr.pincode}_${addr.phone}`;

            if(!seen.has(key)){
                seen.add(key);
                addresses.push({
                    _id: order._id,
                    fullname: addr.fullname,
                    phone: addr.phone,
                    address: addr.address,
                    city: addr.city,
                    state: addr.state,
                    pincode: addr.pincode
                })
            }
        }

        return res.status(200).json({
            success: true,
            addresses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const { page = 1, limit = 10,search = ""} = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const filter = {};

        const orders = await ORDER_MODEL.find(query)
            .populate("user", "fullname email")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await ORDER_MODEL.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum)

        return res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages,
            page: pageNum,
            orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await ORDER_MODEL.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const allowedTransitions = {
            processing: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: []
        };

        if (!allowedTransitions[order.orderStatus].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status change`
            });
        }

        order.orderStatus = status;

        if (status === "delivered") {
            order.paymentInfo.status = "paid";
            order.deliveredAt = new Date();
        }

        if (status === "cancelled") {
            order.cancelledAt = new Date();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const order = await ORDER_MODEL.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.user.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}


module.exports = {
    createOrder,
    getMyOrder,
    getSavedAddresses,
    getAllOrder,
    updateOrderStatus,
    getSingleOrder
}