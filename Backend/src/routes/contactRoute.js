const express = require('express');
const { createMessage, getMessage, getAllMessage, markAsRead } = require('../controllers/contactController');
const router = express.Router();
const isAdmin = require('../middlewares/admin.middleware');
const isAuth = require('../middlewares/auth.middleware');

router.post('/',createMessage);
router.get('/',isAuth,isAdmin,getMessage);
router.get('/all-message',isAuth,isAdmin,getAllMessage);
router.patch('/:id/read',isAuth,isAdmin,markAsRead);

module.exports = router;