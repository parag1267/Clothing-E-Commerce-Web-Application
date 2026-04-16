const express = require('express');
const isAuth = require('../middlewares/auth.middleware');
const { createOrder, getMyOrder, getAllOrder, updateOrderStatus, getSingleOrder, getSavedAddresses } = require('../controllers/orderController');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// User Panel
router.post('/',isAuth,createOrder);
router.get('/my',isAuth,getMyOrder);
router.get('/saved-address',isAuth,getSavedAddresses);

// Admin Panel
router.get('/',isAuth,isAdmin,getAllOrder);
router.put('/:id/status',isAuth,isAdmin,updateOrderStatus);

router.get('/:id',isAuth,getSingleOrder);

module.exports = router;