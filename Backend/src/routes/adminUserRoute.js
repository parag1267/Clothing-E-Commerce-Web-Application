const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const { getAllUsers, getUser, toggleUserStatus, deleteUser, createUser } = require('../controllers/adminUserController');

// =============== ADMIN USER MANAGEMENT =================
router.get('/',isAuth,isAdmin,getAllUsers);
router.get('/:id',isAuth,isAdmin,getUser);
router.post('/create',isAuth,isAdmin,createUser);
router.patch('/:id/status',isAuth,isAdmin,toggleUserStatus);
router.delete('/:id',isAuth,isAdmin,deleteUser);


module.exports = router;