const CART_MODEL = require("../models/cartModel");
const PRODUCT_MODEL = require("../models/productModel");

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const { productId, quantity = 1, size } = req.body;

        if (!productId || !size) {
            return res.status(400).json({
                success: false,
                message: "ProductId and size required"
            })
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            })
        }

        const product = await PRODUCT_MODEL.findById(productId);

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not available"
            })
        }

        let cart = await CART_MODEL.findOne({ user: userId });

        if (!cart) {
            cart = new CART_MODEL({
                user: userId,
                items: []
            })
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId &&
                item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity, size, price: product.price });
        }

        await cart.save();

        const populatedCart = await CART_MODEL.findById(cart._id)
            .populate("items.product", "name price images");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: populatedCart
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;

        const { productId, size, action } = req.body;

        const cart = await CART_MODEL.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        const item = cart.items.find(
            i => i.product.toString() === productId &&
                i.size === size
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not in cart"
            })
        }

        if (action === "inc") {
            item.quantity += 1;
        }
        else if (action === "dec") {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(
                    i => i.product.toString() !== productId
                )
            }
        }

        await cart.save();

        const updatedCart = await CART_MODEL.findById(cart._id)
            .populate("items.product", "name price images");

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const { productId, size } = req.body;

        if (!productId || !size) {
            return res.status(400).json({
                success: false,
                message: "ProductId and size are required"
            });
        }

        const cart = await CART_MODEL.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        cart.items = cart.items.filter(
            item =>
                !(
                    item.product.toString() === productId &&
                    item.size === size
                )
        )

        await cart.save();

        const updatedCart = await CART_MODEL.findById(cart._id)
            .populate("items.product", "name price images");

        res.status(200).json({
            success: true,
            message: "Item removed",
            cart: updatedCart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const cart = await CART_MODEL
            .findOne({ user: userId }).
            populate("items.product", "name price images");

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: { items: [] },
                totalprice: 0
            })
        }

        let totalprice = 0;

        cart.items.forEach(item => {
            if (item.product) {
                totalprice += item.product.price * item.quantity;
            }
        })

        res.status(200).json({
            success: true,
            message: "Total price calculation successfully",
            cart,
            totalprice
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart
}