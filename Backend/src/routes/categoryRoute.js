const express = require('express');
const { getAllCategory, getSingleCategory, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } = require('../controllers/categoryController');
const upload = require('../middlewares/upload');

const router = express.Router();

// User side
router.get('/',getAllCategory);
router.get('/:slug',getSingleCategory);

// Admin side
router.post('/', upload.single('image') ,createCategory);
router.put('/:id', upload.single('image') ,updateCategory);
router.delete('/:id',deleteCategory);
router.patch('/:id/status',toggleCategoryStatus);

module.exports = router; 