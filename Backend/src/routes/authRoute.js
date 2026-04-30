const express = require('express');
const { signup, signin, logout, profile, refreshToken, updateProfile, googleAuthCallback } = require('../controllers/userController');
const isAuth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');
const passport = require('passport');

const router = express.Router();

// =============== LOCAL AUTH =================
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',logout);
router.get('/profile',isAuth ,profile);
router.put('/profile',isAuth,upload.single("profileImage"),updateProfile);
router.get('/refresh',refreshToken);

// =============== GOOGLE OAUTH =================
router.get('/google',
    passport.authenticate('google',{
        scope: ['profile','email'],
        session: false
    })
)

router.get('/google/callback',
    passport.authenticate('google',{
        failureRedirect: '/api/auth/google/failure',
        session: false
    }),
    googleAuthCallback
)

router.get('/google/failure',(req,res) => {
    res.status(401).json({
        success: false,
        message:"Google authentication failed"
    })
})


module.exports = router;