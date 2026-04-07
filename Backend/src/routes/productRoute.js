const express = require('express');
const upload = require('../middlewares/upload');
const { createProduct, getAllProducts, deleteProduct, updateProduct, toggleProductStatus, searchProducts, getproductsByCategory, getProductsByTag, getSingleProduct, getTabs, getAllTrendingProducts, getAllPoloTrendingProducts, getNewArrivalProducts, updatedNewArrival } = require('../controllers/productController');

const router = express.Router();


// User Routes
router.get('/all-trending',getAllTrendingProducts);
router.get('/polo-trending',getAllPoloTrendingProducts);
router.get('/search',searchProducts);
router.get('/newarrival',getNewArrivalProducts);
router.get('/category/:categoryId',getproductsByCategory);
router.get('/tags/:tag',getProductsByTag);
router.get('/:id',getSingleProduct);

// Admin Routes
router.post('/',upload.array("images",8),createProduct);
router.put('/:id',upload.array("images",8),updateProduct);
router.delete('/:id',deleteProduct);
router.patch('/:id/status',toggleProductStatus);
router.patch('/newarrival/:id',updatedNewArrival);

// Generic Routes
router.get('/',getAllProducts);
router.get('/Allcategory/tabs/:category',getTabs);



module.exports = router