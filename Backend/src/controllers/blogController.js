const BLOG_MODEL = require('../models/blogModel');
const slugify = require('slugify');
const uploadImage = require('../utils/cloudinaryUpload');
const cloudinary = require('../config/cloudinary');

const createBlog = async (req, res) => {
    try {
        const { title, content, author, tags, isPublished } = req.body;
        let imageData = {};

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and Content are required"
            })
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Cover Image is required"
            })
        }

        imageData = await uploadImage(
            req.file.buffer,
            "Creative-Lifestyle/Blogs"
        )

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one tag is required"
            })
        }

        let parsedTags = tags;

        if(typeof tags === "string"){
            parsedTags = JSON.parse(tags);
        }

        const slug = slugify(title, { lower: true, strict: true })

        const existingSlug = await BLOG_MODEL.findOne({ slug })

        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: "Blog with this title already exists"
            })
        }

        const blog = await BLOG_MODEL.create({
            title,
            slug,
            content,
            author,
            tags: parsedTags,
            isPublished,
            coverImage: imageData
        })

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const blog = await BLOG_MODEL.find({ isPublished: true, isActive: false }).sort({ createdAt: -1 })

        if (blog.length === 0) {
            return res.status(400).json({
                success: true,
                message: "No blog found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getSingleBlog = async (req, res) => {
    try {
        const slug = req.params.slug?.trim();

        const blog = await BLOG_MODEL.findOne({ slug, isActive: false, isPublished: true }).lean()

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            })
        }

        const blog = await BLOG_MODEL.findByIdAndUpdate(
            { _id: id, isActive: false },
            { isActive: true },
            { new: true })

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Blog delete successfully",
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            })
        }

        const blog = await BLOG_MODEL.findOne({ _id: id, isActive: false })

        if (!blog) {
            return res.status(400).json({
                success: false,
                message: "Blog not found"
            })
        }

        const { title, content, author, tags } = req.body;

        let updateData = {};

        if (title) {
            const newSlug = slugify(title, { lower: true, strict: true })

            const existingSlug = await BLOG_MODEL.findOne({
                slug: newSlug,
                _id: { $ne: id }
            })

            if (existingSlug) {
                return res.status(400).json({
                    success: false,
                    message: "Blog with this title already exists"
                })
            }
            updateData.title = title
            updateData.slug = newSlug
        }

        if (content) {
            updateData.content = content;
        }

        if (author) {
            updateData.author = author;
        }

        if (tags) {
            if (!Array.isArray(tags) || tags.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one tag is required"
                })
            }
            updateData.tags = tags
        }

        if (req.file) {
            if (blog.coverImage?.public_id) {
                await cloudinary.uploader.destroy(blog.coverImage.public_id);
            }

            const imageData = await uploadImage(
                req.file.buffer,
                "Creative-Lifestyle/Blogs"
            )
            updateData.coverImage = imageData
        }

        const updatedBlog = await BLOG_MODEL.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const searchBlog = async (req, res) => {
    try {
        const { query, tag } = req.query;

        let filter = {
            isActive: false,
            isPublished: true
        }

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { author: { $regex: query, $options: "i" } }
            ]
        }

        if (tag) {
            filter.tags = { $in: [tag] }
        }

        const blog = await BLOG_MODEL.find(filter).sort({ createdAt: -1 })
        console.log(blog);

        if (blog.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Blog search successfully",
            TotalBlog: blog.length,
            blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
    searchBlog
}