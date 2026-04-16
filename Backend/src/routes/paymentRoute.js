const express = require('express');
const isAuth = require('../middlewares/auth.middleware');
const { createSession, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create/session',isAuth,createSession);
router.post('/verify',isAuth,verifyPayment);

module.exports = router;
