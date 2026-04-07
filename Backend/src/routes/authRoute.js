const express = require('express');
const { signup, signin, logout, profile, refreshToken, updateProfile } = require('../controllers/userController');
const isAuth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');

const router = express.Router();

// =============== AUTH =================
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',logout);
router.get('/profile',isAuth ,profile);
router.put('/profile',isAuth,upload.single("profileImage"),updateProfile);
router.get('/refresh',refreshToken);




module.exports = router;