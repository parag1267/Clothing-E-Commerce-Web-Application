const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const productRoute = require('./productRoute');
const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const addToCartRoute = require('./cartRoute');
const wishlistRoute = require('./wishlistRoute');
const blogRoute = require('./blogRoute');
const adminUserRoute = require('./adminUserRoute');

// ================== PUBLIC =================
router.use('/auth',authRoute)
router.use('/category',categoryRoute);
router.use('/subCategory',subCategoryRoute);
router.use('/products',productRoute);
router.use('/cart',addToCartRoute);
router.use('/wishlist',wishlistRoute)
router.use('/blog',blogRoute);

// ================== ADMIN =================
router.use('/admin/users',adminUserRoute)

module.exports = router;