const express = require('express');
const { createBlog, getAllBlogs, getSingleBlog, deleteBlog, updateBlog, searchBlog } = require('../controllers/blogController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', upload.single('image') ,createBlog);
router.get('/search',searchBlog);
router.get('/slug/:slug',getSingleBlog);
router.get('/',getAllBlogs);
router.delete('/:id',deleteBlog);
router.put('/:id', upload.single('image') ,updateBlog);

module.exports = router;