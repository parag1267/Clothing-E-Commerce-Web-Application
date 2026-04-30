const slugify = require('slugify');
const CATEGORYMODEL = require('../models/categoryModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const uploadImage = require('../utils/cloudinaryUpload');

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description both are required"
            })
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }

        const existing = await CATEGORYMODEL.findOne({ name });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            })
        }
        const result = await uploadImage(
            req.file.buffer,
            "Creative-Lifestyle/categories"
        );

        const categories = await CATEGORYMODEL.create({
            name,
            slug: slugify(name, { lower: true }),
            description,
            images: {
                url: result.url,
                public_id: result.public_id
            }
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            categories
        })
    } catch (error) {
        console.log("Create Error:", error);
        res.status(500).json({
            success: false,
            message: error || "Internal server error"
        })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const categories = await CATEGORYMODEL.find({ isActive: true }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getSingleCategory = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            })
        }

        const category = await CATEGORYMODEL.findOne({
            slug,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Category fetch successfully",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category id is required"
            })
        }

        const category = await CATEGORYMODEL.findById(id);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category not found"
            })
        }

        if (name) {
            const existing = await CATEGORYMODEL.findOne({ name })

            if (existing && existing._id.toString() !== id) {
                return res.status(400).json({
                    success: false,
                    message: "Category already exists"
                })
            }
        }


        if (req.file) {
            if(category.images?.public_id){
                await cloudinary.uploader.destroy(category.images.public_id)
            }

            const result = await uploadImage(
                req.file.buffer,
                "Creative-Lifestyle/categories"
            )

            category.images = {
                url: result.url,
                public_id: result.public_id
            }
        }

        if (name) {
            category.name = name;
            category.slug = slugify(name, { lower: true });
        }

        if (description) {
            category.description = description;
        }
        await category.save();

        // const updatedCategory = await CATEGORYMODEL.findByIdAndUpdate(
        //     id,
        //     updateData,
        //     { new: true }
        // )

        res.status(200).json({
            success: true,
            message: "Category Updated",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is missing"
            })
        }
        const category = await CATEGORYMODEL.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        category.isActive = false;
        await category.save();

        res.status(200).json({
            success: true,
            message: "Category delete successfully",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is missing"
            })
        }

        const category = await CATEGORYMODEL.findById(id);

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category not found"
            })
        }

        category.isActive = !category.isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category status updated",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus
}