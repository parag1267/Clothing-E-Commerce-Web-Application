const CATEGORY_MODEL = require("../models/categoryModel");
const SUBCATEGORY_MODEL = require("../models/subCategoryModel");
const PRODUCT_MODEL = require("../models/productModel");
const { uploadImage, deleteImage } = require("../utils/cloudinaryUpload");
const slugify = require("slugify");
const mongoose = require("mongoose");

const generateSKU = (productName, size = "GEN") => {
    const nameCode = productName.substring(0, 3).toUpperCase();
    const sizeCode = size;
    const uniqueCode = Date.now().toString().slice(-5);

    return `${nameCode}-${sizeCode}-${uniqueCode}`
}

const generateUniqueSlug = async (name, productId = null) => {
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (productId) {
            query._id = { $ne: productId };
        }

        const existingProduct = await PRODUCT_MODEL.findOne(query);

        if (!existingProduct) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

const createProduct = async (req, res) => {
    try {
        const { name, description, brand, price, discountPercentage, category, subCategory, fabric, fitType, tags, manufacturer, sizes, isNewArrival, isTrending, isActive } = req.body;

        let parsedTags = tags;
        let parsedManufacturer = manufacturer;
        let parsedSizes = sizes;

        if (typeof tags === "string") {
            parsedTags = JSON.parse(tags).map(t => t.trim());
        }

        if (typeof manufacturer === "string") {
            parsedManufacturer = JSON.parse(manufacturer)
        }

        if (typeof sizes === "string") {
            parsedSizes = JSON.parse(sizes)
        }

        if (!name || !description || !brand || price == null || !category || !subCategory || !fabric || !fitType || !tags || !sizes) {
            return res.status(400).json({
                success: false,
                message: "Required missing all fields"
            })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Product images required"
            })
        }

        if (parsedTags && !Array.isArray(parsedTags)) {
            return res.status(400).json({
                success: false,
                message: "Tags must be an array"
            })
        }

        if (parsedSizes && !Array.isArray(parsedSizes)) {
            return res.status(400).json({
                success: false,
                message: 'Sizes must be an array'
            })
        }

        const categoryExists = await CATEGORY_MODEL.findOne({ slug: category });

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const subCategoryExists = await SUBCATEGORY_MODEL.findOne({ slug: subCategory });

        if (!subCategoryExists) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            })
        }

        const slug = await generateUniqueSlug(name);
        const sku = generateSKU(name, "GEN");

        // Size sku
        let finalSizes = [];
        if (parsedSizes && Array.isArray(parsedSizes)) {
            finalSizes = parsedSizes.map(s => ({
                size: s.size.trim().toUpperCase(),
                stock: Number(s.stock),
                sku: generateSKU(name, s.size)
            }))
        }

        const imageUrls = [];

        for (const file of req.files) {
            const result = await uploadImage(
                file.buffer,
                "Creative-Lifestyle/products"
            );

            imageUrls.push({
                url: result.url,
                public_id: result.public_id
            });
        }

        const product = await PRODUCT_MODEL.create({
            name,
            slug,
            description,
            brand,
            price,
            discountPercentage,
            category: categoryExists._id,
            subCategory: subCategoryExists._id,
            fabric,
            fitType,
            sku,
            images: imageUrls,
            tags: parsedTags,
            manufacturer: parsedManufacturer,
            sizes: finalSizes,
            isNewArrival: isNewArrival === "true" || isNewArrival === true,
            isTrending: isTrending === "true" || isTrending === true,
            isActive: isActive !== "false" && isActive !== false
        })

        res.status(201).json({
            success: true,
            message: "Product Created successfully",
            product
        })
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { tab, category, page = 1, limit = 20, minPrice, maxPrice, brands, sizes,sort } = req.query;

        let filter = { isActive: true };

        if (category) {
            const categoryData = await CATEGORY_MODEL.findOne({ slug: category });
            if (categoryData) {
                filter.category = categoryData._id;
            }
        }

        if (tab === "trending") {
            filter.isTrending = true;
        }

        else if (tab === "isNewArrival") {
            filter.isNewArrival = true;
        }

        else if (tab === "active") {
            filter.isActive = true;
        }

        else if (tab === "inactive") {
            filter.isActive = false;
        }

        else if (tab) {
            const slugArray = tab.split(",").map(s => s.trim())

            const subCategoryDocs = await SUBCATEGORY_MODEL.find({
                slug: { $in: slugArray }
            })

            if (subCategoryDocs.length > 0) {
                filter.subCategory = {
                    $in: subCategoryDocs.map(s => s._id)
                }
            }
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }

        if (brands) {
            const brandArray = brands.split(",").map(b => b.trim());
            if(brandArray.length > 0){
                filter.brand = { $in: brandArray };
            }
        }

        if (sizes) {
            const sizeArray = sizes.split(",").map(s => s.trim());
            if(sizeArray.length > 0){
                filter["sizes.size"] = { $in: sizeArray };
            }
        }

        const skip = (page - 1) * limit;

        const brandBaseFilter = { isActive: true };
        if (filter.category) brandBaseFilter.category = filter.category;
        if (filter.subCategory) brandBaseFilter.subCategory = filter.subCategory;

        const sizeBaseFilter = { isActive: true };
        if(filter.category) sizeBaseFilter.category = filter.category;

        const menCategory = await CATEGORY_MODEL.findOne({ slug: "men" });
        const womenCategory = await CATEGORY_MODEL.findOne({ slug: "women" });

        let sortOption = { createdAt: -1 }

        if(sort === "price_asc") sortOption = { price: 1}
        else if(sort === "price_desc") sortOption = { price: -1}
        else if(sort === "newest") sortOption = { createdAt: -1}

        const [products, availableBrands, availableSizes, totalProducts, allCount, allMen, allWomen, activeCount, inactiveCount, isNewArrival, trendingCount] = await Promise.all([
            PRODUCT_MODEL.find(filter)
                .populate("category", "name slug")
                .populate("subCategory", "name slug")
                .skip(skip)
                .limit(Number(limit))
                .sort(sortOption),

            PRODUCT_MODEL.distinct("brand", brandBaseFilter),
            PRODUCT_MODEL.distinct("sizes.size",sizeBaseFilter),

            PRODUCT_MODEL.countDocuments(filter),

            PRODUCT_MODEL.countDocuments({}),
            PRODUCT_MODEL.countDocuments({ category: menCategory?._id }),
            PRODUCT_MODEL.countDocuments({ category: womenCategory?._id }),
            PRODUCT_MODEL.countDocuments({ isActive: true }),
            PRODUCT_MODEL.countDocuments({ isActive: false }),
            PRODUCT_MODEL.countDocuments({ isNewArrival: true }),
            PRODUCT_MODEL.countDocuments({ isTrending: true })
        ])


        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            totalProducts: products.length,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / limit),
            availableBrands: availableBrands.sort(),
            availableSizes: availableSizes.sort(),
            counts: {
                all: allCount,
                men: allMen,
                women: allWomen,
                active: activeCount,
                inactive: inactiveCount,
                isNewArrival,
                trending: trendingCount
            },
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const product = await PRODUCT_MODEL.findByIdAndUpdate(id, { isActive: false }, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Product Id is required"
            })
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Body is an required"
            })
        }

        const { name, description, brand, price, discountPercentage, category, subCategory, fabric, fitType, sizes, tags, manufacturer, isNewArrival, isTrending, isActive, removeImages } = req.body || {};

        const product = await PRODUCT_MODEL.findById(id);

        if (!product || product.isActive === false) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (category) {
            const categoryExists = await CATEGORY_MODEL.findOne({ slug: category });

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                })
            }
        }

        if (subCategory) {
            const subCategoryExists = await SUBCATEGORY_MODEL.findOne({ slug: subCategory });

            if (!subCategoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "SubCategory not found"
                })
            }
        }

        let updateData = {};

        if (name) {
            const newSlug = await generateUniqueSlug(name, id);
            updateData.name = name;
            updateData.slug = newSlug;
        }

        if (description) {
            updateData.description = description;
        }

        if (brand) {
            updateData.brand = brand;
        }

        if (price !== undefined) {
            updateData.price = Number(price);
        }

        if (discountPercentage !== undefined) {
            updateData.discountPercentage = Number(discountPercentage);
        }

        if (fabric) {
            updateData.fabric = fabric;
        }

        if (fitType) {
            updateData.fitType = fitType;
        }

        if (category) {
            const cat = await CATEGORY_MODEL.findOne({ slug: category })
            updateData.category = cat._id;
        }

        if (subCategory) {
            const subCat = await SUBCATEGORY_MODEL.findOne({ slug: subCategory })
            updateData.subCategory = subCat._id;
        }

        if (tags) {
            let parsedTags = tags;
            if (typeof tags === "string") {
                parsedTags = JSON.parse(tags).map(t => t.trim());
            }

            if (!Array.isArray(parsedTags)) {
                return res.status(400).json({
                    success: false,
                    message: "Tags must be an array"
                })
            }
            updateData.tags = parsedTags;
        }

        if (sizes) {
            let parsedSizes = sizes;
            if (typeof sizes === "string") {
                parsedSizes = JSON.parse(sizes);
            }

            if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one size required"
                })
            }

            // Duplicate size
            const sizeSet = new Set();
            for (const s of parsedSizes) {
                if (sizeSet.has(s.size)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate size: ${s.size}`
                    })
                }
                sizeSet.add(s.size);
            }

            updateData.sizes = parsedSizes.map(s => ({
                size: s.size.trim().toUpperCase(),
                stock: Number(s.stock) || 0,
                sku: s.sku || generateSKU(name || product.name, s.size)
            }))

            updateData.stock = updateData.sizes.reduce(
                (total, s) => total + (s.stock || 0), 0
            )
        }

        if (manufacturer) {
            let parsedManufacturer = manufacturer;
            if (typeof manufacturer === "string") {
                parsedManufacturer = JSON.parse(manufacturer);
            }
            updateData.manufacturer = parsedManufacturer;
        }

        if (isNewArrival !== undefined) {
            updateData.isNewArrival = isNewArrival === "true" || isNewArrival === true;;
        }

        if (isTrending !== undefined) {
            updateData.isTrending = isTrending === "true" || isTrending === true;
        }

        if (isActive !== undefined) {
            updateData.isActive = isActive === "true" || isActive === true;
        }

        // Cloudinary - Specific Image Delete
        if (removeImages) {
            let publicIds = removeImages;
            if (typeof removeImages === "string") {
                publicIds = JSON.parse(removeImages)
            }

            if (Array.isArray(publicIds) && publicIds.length > 0) {
                await Promise.all(
                    publicIds.map(public_id => deleteImage(public_id))
                )

                updateData.images = product.images.filter(
                    img => !publicIds.includes(img.public_id)
                )
            }
        }

        if (req.files && req.files.length > 0) {
            const newImageUrls = [];
            for (const file of req.files) {
                const result = await uploadImage(file.buffer,
                    "Creative-Lifestyle/products"
                )

                newImageUrls.push({
                    url: result.url,
                    public_id: result.public_id
                })
            }
            const existingImages = updateData.images || product.images;
            updateData.images = [...existingImages, ...newImageUrls]
        }

        const updatedProduct = await PRODUCT_MODEL.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.body?.isActive;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Product ID is required"
            })
        }

        if (typeof isActive !== "boolean") {
            return res.status(404).json({
                success: false,
                message: "Body isActive must be true or false"
            })
        }

        const product = await PRODUCT_MODEL.findByIdAndUpdate(id, { isActive }, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: `Product ${product.isActive ? "Activated" : "Deactivated"} successfully`,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const updatedNewArrival = async (req, res) => {
    try {
        const { id } = req.params;
        const { isNewArrival } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID is required"
            })
        }


        if (typeof isNewArrival !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Body isNewArrival must be true or false"
            })
        }

        const product = await PRODUCT_MODEL.findByIdAndUpdate(
            { _id: id, isActive: true },
            { isNewArrival },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: isNewArrival
                ? "Product marked as new Arrival"
                : "Product removed from New Arrival",
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const searchProducts = async (req, res) => {
    try {
        const { query, category } = req.query;
        let filter = { isActive: true }

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } }
            ]
        }

        if (category) {
            filter.category = category;
        }

        const products = await PRODUCT_MODEL.find(filter).populate("category subCategory");

        res.status(200).json({
            success: true,
            message: "Search product successfully",
            TotalProducts: products.length,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getNewArrivalProducts = async (req, res) => {
    try {
        const { page = 1, limit } = req.query;
        const pageNum = Number(page);

        const limitNum = limit ? Number(limit) : 8;
        const skip = (pageNum - 1) * limitNum;

        const query = {
            isNewArrival: true,
            isActive: true
        }

        const products = await PRODUCT_MODEL.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate("category", "name")
            .populate("subCategory", "name");

        const total = await PRODUCT_MODEL.countDocuments(query);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No new arrival products found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product featured fetched successfully",
            products,
            totalProducts: total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getproductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID not found"
            })
        }

        const productByCategory = await PRODUCT_MODEL.find({ category: categoryId, isActive: true })
            .populate("category subCategory")
            .limit(10)
            .skip((page - 1) * limit);

        if (!productByCategory || productByCategory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product by category fetched data successfully",
            TotalProductByCategory: productByCategory.length,
            product: productByCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }

}

const getProductsByTag = async (req, res) => {
    try {
        const { tag } = req.params;

        if (!tag) {
            return res.status(400).json({
                success: false,
                message: "Tag not found"
            })
        }

        const productByTag = await PRODUCT_MODEL.find({ tags: tag })

        if (!productByTag || productByTag.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found with this tag"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            TotalProductByTag: productByTag.length,
            product: productByTag
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllTrendingProducts = async (req, res) => {
    try {
        const products = await PRODUCT_MODEL.find({
            isTrending: true,
            isActive: true
        })
            .populate("category", "name")
            .populate("subCategory", "name")
            .limit(8);

        res.status(200).json({
            success: true,
            message: "Trending All products fectched successfully",
            totalProducts: products.length,
            trendingAll: products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getAllPoloTrendingProducts = async (req, res) => {
    try {
        const poloSubCategory = await SUBCATEGORY_MODEL
            .findOne({ slug: "polos" })
            .select("_id name");

        if (!poloSubCategory) {
            return res.status(404).json({
                success: false,
                message: "Polo subCategory not found"
            })
        }

        const products = await PRODUCT_MODEL.find({
            subCategory: poloSubCategory._id,
            isTrending: true,
            isActive: true
        })
            .select("name description brand discountPercentage fabric fitType varinats tags price images category subCategory createdAt isTrending")
            .populate("category", "name")
            .populate("subCategory", "name")
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        res.status(200).json({
            success: true,
            message: "Trending polo products fectched successfully",
            totalProducts: products.length,
            trendingPolo: products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Product Id invalid"
            })
        }

        const product = await PRODUCT_MODEL.findById(id)
            .populate("category", "name slug")
            .populate("subCategory", "name slug")

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

const getTabs = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category slug is required"
            })
        }

        const categoryData = await CATEGORY_MODEL.findOne({ slug: category });

        if (!categoryData) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        const subCategories = await SUBCATEGORY_MODEL.aggregate([
            {
                $match: {
                    category: new mongoose.Types.ObjectId(categoryData._id)
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    slug: 1
                }
            }
        ]);

        const tabs = [
            { name: "Trending", slug: "trending", type: "tag" },
            ...subCategories.map((sub) => ({
                name: sub.name,
                slug: sub.slug,
                type: "subCategory"
            }))
        ];

        res.json({
            success: true,
            message: "Tabs added successfully",
            tabs
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
    toggleProductStatus,
    updatedNewArrival,
    searchProducts,
    getNewArrivalProducts,
    getproductsByCategory,
    getProductsByTag,
    getSingleProduct,
    getTabs,
    getAllTrendingProducts,
    getAllPoloTrendingProducts
}