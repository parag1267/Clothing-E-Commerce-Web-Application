const CATEGORY_MODEL = require('../models/categoryModel');
const SUBCATEGORY_MODEL = require('../models/subCategoryModel');
const PRODUCT_MODEL = require('../models/productModel');
const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');
const uploadImage = require('../utils/cloudinaryUpload');

const createSubCategory = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and Category are required"
            })
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }

        const categoryExists = await CATEGORY_MODEL.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const slug = slugify(`${name}-${categoryExists.name}`, { lower: true });

        const existing = await SUBCATEGORY_MODEL.findOne({ slug });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Subcategory already exists"
            })
        }

        const result = await uploadImage(
            req.file.buffer,
            "Creative-Lifestyle/subCategories"
        );

        const subCategory = await SUBCATEGORY_MODEL.create({
            name,
            slug,
            category: categoryExists._id,
            images: {
                url: result.url,
                public_id: result.public_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Subcategory Created successfully",
            subCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllSubCategory = async (req, res) => {
    try {
        const { category } = req.query;

        let query = { isActive: true };

        if (category) {
            const categoryDoc = await CATEGORY_MODEL.findOne({ slug: category });

            if (!categoryDoc) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

            query.category = categoryDoc._id;
        }


        const subCategory = await SUBCATEGORY_MODEL
            .find(query)
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            subCategories: subCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getSingleSubCategory = async (req, res) => {
    try {
        const { slug } = req.params;

        const subCategory = await SUBCATEGORY_MODEL.findOne({ slug, isActive: true }).populate("category", "name");

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subcategory fetched data successfully",
            subCategories: subCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SUBCATEGORY_MODEL.findById(id);

        if (!subCategory) {
            res.status(404).json({
                success: false,
                message: "Subcategory not found"
            })
        }

        const productExists = await PRODUCT_MODEL.findOne({ subCategory: id });

        if (productExists) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete subcategory with products"
            })
        }

        subCategory.isActive = false;
        await subCategory.save();

        res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
            subCategory
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID not found"
            })
        }

        const subCategory = await SUBCATEGORY_MODEL.findById(id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            })
        }

        let categoryExists;

        if (category) {
            categoryExists = await CATEGORY_MODEL.findById(category);

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                })
            }
        }


        if (req.file) {
            if(subCategory.images?.public_id){
                await cloudinary.uploader.destroy(subCategory.images.public_id)
            }

            const result = await uploadImage(
                req.file.buffer,
                "Creative-Lifestyle/subCategories"
            )

            subCategory.images = {
                url: result.url,
                public_id: result.public_id
            }
        }

        

        if (name) {
            subCategory.name = name;
            const categoryData = categoryExists || await CATEGORY_MODEL.findById(subCategory.category);
            subCategory.slug = slugify(`${name}-${categoryData.name}`, { lower: true });
        }

        if (category) {
            subCategory.category = category;
        }


        // const updatedSubCategory = await SUBCATEGORY_MODEL.findByIdAndUpdate(
        //     id,
        //     updateData,
        //     { new: true }
        // )

        await subCategory.save();

        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            subCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const toggleSubCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SUBCATEGORY_MODEL.findById(id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            })
        }

        subCategory.isActive = !subCategory.isActive;

        const isActiveUpdated = await subCategory.save();

        res.status(200).json({
            success: true,
            message: "Subcategory isActive updated successfully",
            subCategories: isActiveUpdated
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    createSubCategory,
    getAllSubCategory,
    getSingleSubCategory,
    deleteSubCategory,
    updateSubCategory,
    toggleSubCategoryStatus
}