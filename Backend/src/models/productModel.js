const mongoose = require('mongoose');

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "40"]

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "Image URL is required"]
    },
    public_id: {
        type: String,
        required: [true, "Public ID is required"]
    }
}, { _id: false });


const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        required: [true, "Size is required"],
        enum: {
            values: ALL_SIZES,
            message: "Valid size"
        },
        uppercase: true,
        trim: true
    },
    stock: {
        type: Number,
        required: [true, "Stock for this size is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    sku: {
        type: String,
        uppercase: true,
        trim: true
    }
}, { _id: false })

const manufacturerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: "Generic Manufacturer"
    },

    contactPhone: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, "Phone must be 10 digits"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            "Invalid email address"
        ]
    },

    address: {
        street: {
            type: String,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true,
            default: "India"
        },
        pincode: {
            type: String,
            trim: true,
            match: [/^\d{6}$/, "Invalid pincode"]
        }
    }
}, { _id: false })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [4, "Name must be at least 4 charatcters"],
        maxlength: [120, "Name cannot exceed 120 charcters"]
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        required: [true, "Descriprion is required"]
    },

    brand: {
        type: String,
        required: [true, "Brand is required"],
        trim: true
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },

    discountPercentage: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
        max: [90, "Discount too high"]
    },

    discountPrice: {
        type: Number
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },

    fabric: {
        type: String,
        required: [true, "Fabric is required"],
        trim: true
    },

    fitType: {
        type: String,
        required: [true, "Fittype is required"],
        trim: true
    },

    images: {
        type: [imageSchema],
        validate: [arr => arr.length > 0, "At least one image is required"]
    },

    sizes: {
        type: [sizeSchema],
        default: []
    },

    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"],
        default: 0
    },

    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    manufacturer: {
        type: manufacturerSchema,
        default: () => ({})
    },

    returnPolicy: {
        type: String,
        default: "7 days return available"
    },

    tags: {
        type: [String],
        default: []
    },

    isNewArrival: {
        type: Boolean,
        default: false
    },

    isTrending: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


productSchema.pre("save", function () {
    if (this.discountPercentage > 0) {
        this.discountPrice = Math.round(this.price - (this.price * this.discountPercentage) / 100);
    } else {
        this.discountPrice = Math.round(this.price);
    }

    if (this.sizes && this.sizes.length > 0) {
        this.stock = this.sizes.reduce(
            (total, s) => total + (s.stock || 0), 0
        );
    }
})

productSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate();

    const existingProduct = await this.model.findOne(this.getQuery())
    const price = update.price ?? existingProduct.price;
    const discount = update.discountPercentage ?? existingProduct.discountPercentage;

    if (price !== undefined && discount !== undefined) {
        if (discount > 0) {
            update.discountPrice = Math.round(
                price - (price * discount) / 100
            );
        }
        else {
            update.discountPrice = Math.round(price)
        }
    }

    if (update.sizes && Array.isArray(update.sizes)) {
        update.stock = update.sizes.reduce(
            (total, s) => total + (s.stock || 0), 0
        )
    }
})

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ isFeatured: 1, isTrending: 1, isActive: 1 });

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;