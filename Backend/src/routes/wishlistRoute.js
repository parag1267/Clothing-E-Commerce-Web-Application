const express = require('express');
const isAuth = require('../middlewares/auth.middleware');
const { toggleWishlist, getWishlist, removeFromWishlist, clearWishlist, moveToCart } = require('../controllers/wishlistController');

const router = express.Router();

router.post("/toggle",isAuth,toggleWishlist);
router.get("/",isAuth,getWishlist);
router.delete("/:productId",isAuth,removeFromWishlist);
router.delete("/",isAuth,clearWishlist);
router.post("/move-to-cart",isAuth,moveToCart);

module.exports = router;