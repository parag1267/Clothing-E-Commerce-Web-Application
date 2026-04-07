const WISHLIST_MODEL = require('../models/wishlistModel');
const CART_MODEL = require('../models/cartModel');

const toggleWishlist = async (req,res) => {
    try {
        const userId = req.user.id;

        const {productId} = req.body;

        if(!productId){
            return res.status(400).json({
                success: false,
                message: "Product ID required"
            })
        }

        let wishlist = await WISHLIST_MODEL.findOne({user: userId});

        if(!wishlist){
            wishlist = await WISHLIST_MODEL.create({
                user: userId,
                products: [productId]
            })

            return res.status(201).json({
                success: true,
                message: "Added to wishlist",
                wishlist
            })
        }

        const isExist = wishlist.products.some(
            (item) => item.toString() === productId
        );

        if(isExist){
            wishlist.products.pull(productId);
            await wishlist.save();
            await wishlist.populate("products");

            return res.status(200).json({
                success: true,
                message: "Removed from wishlist",
                wishlist
            })
        }

        else {
            wishlist.products.addToSet(productId);
            await wishlist.save();
            await wishlist.populate("products");

            return res.status(200).json({
                success: true,
                message: "Added to wishlist",
                wishlist
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getWishlist = async (req,res) => {
    try {
        const wishlist = await WISHLIST_MODEL.findOne({user: req.user.id})
            .populate("products");

        res.status(200).json({
            success: true,
            wishlist: wishlist || {products: []}
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const removeFromWishlist = async (req,res) => {
    try {
        const {productId} = req.params;

        const wishlist = await WISHLIST_MODEL.findOneAndUpdate(
            {user: req.user.id},
            {$pull: {products: productId}},
            {new: true}
        );

        if(!wishlist){
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Removed successfully",
            wishlist
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const clearWishlist = async (req,res) => {
    try {
        const wishlist = await WISHLIST_MODEL.findOneAndUpdate(
            {user: req.user.id},
            {$set: {products: []}},
            {new: true}
        )

        res.status(200).json({
            success: true,
            message: "Wishlist cleared",
            wishlist
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const moveToCart = async (req,res) => {
    try {
        const userId = req.user.id;
        const {productId} = req.body;

        if(!productId){
            return res.status(400).json({
                success: false,
                message: "Product ID not found"
            })
        }

        let cart = await CART_MODEL.findOne({user: userId});

        if(!cart){
            cart = await CART_MODEL.create({
                user: userId,
                items: [{product: productId,quantity: 1}],
            })
        }else {
            const existingItem = cart.items.find(
                (item) => item.product.toString() === productId
            )

            if(existingItem){
                existingItem.quantity += 1;
            }else {
                cart.items.push({product: productId,quantity: 1});
            }

            await cart.save()
        }

        await WISHLIST_MODEL.findOneAndUpdate(
            {user: userId},
            {$pull: {products: productId}}
        )

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Moved to Cart successfully",
            cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    toggleWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart
}