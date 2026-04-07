const express = require('express');
const { createSubCategory, getAllSubCategory, getSingleSubCategory, deleteSubCategory, updateSubCategory, toggleSubCategoryStatus } = require('../controllers/subCategoryController');
const upload = require('../middlewares/upload');

const router = express.Router();

// User side
router.get('/',getAllSubCategory);
router.get('/:slug',getSingleSubCategory);

// Admin side
router.post('/',upload.single('image'),createSubCategory);
router.put('/:id',upload.single('image'),updateSubCategory);
router.delete('/:id',deleteSubCategory);
router.patch('/:id/status',toggleSubCategoryStatus);

module.exports = router;