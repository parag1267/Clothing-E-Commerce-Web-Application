const express = require('express');
const isAuth = require('../middlewares/auth.middleware');
const { addToCart, updateCartItem, removeFromCart, getCart } = require('../controllers/cartController');

const router = express.Router();


router.get("/",isAuth,getCart);
router.post("/add",isAuth,addToCart);
router.put("/update",isAuth,updateCartItem);
router.delete("/remove",isAuth,removeFromCart);


module.exports = router;