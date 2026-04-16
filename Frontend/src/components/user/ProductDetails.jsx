import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRelatedProducts, fetchSingleProduct } from '../../features/products/productSlice';
import { ChevronDown, ChevronUp, Heart, RotateCcw, Shield, Star, Truck } from 'lucide-react';
import { addToCart, fetchCart } from '../../features/cart/cartSlice';
import { getWishlist, toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { motion } from "framer-motion";


const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { product, loading, relatedProducts } = useSelector((state) => state.products);
    const { cart } = useSelector((state) => state.cart);
    const { wishlist } = useSelector((state) => state.wishlist);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedQuantity,setSelectedQuantity] = useState(1);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [sizeError, setSizeError] = useState("");

    useEffect(() => {
        dispatch(fetchSingleProduct(id))
        dispatch(getWishlist())
        dispatch(fetchCart())
    }, [id, dispatch]);

    useEffect(() => {
        if (product?.subCategory) {
            dispatch(fetchRelatedProducts({
                subCategory: product.subCategory.slug || product.subCategory,
                excludeId: product._id
            }))
        }
    }, [product, dispatch])

    const handleSizeSelect = (sizeObject) => {
        if(sizeObject.stock === 0) return 
        setSelectedSize(sizeObject.size)
        setSelectedQuantity(1)
        setSizeError("")
    }

    if (loading) return <p className="p-5">Loading...</p>;
    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <p className="text-gray-500 text-lg">No Product found..</p>
        </div>
    )

    const isInCart = cart?.items?.some(
        (item) =>
            item.product._id === product._id &&
            item.size === selectedSize
    )

    const uniqueSizes = [
        ...new Set(product.sizes || [])
    ]

    const selectedSizeObj = uniqueSizes.find(s => s.size === selectedSize)
    const maxQuantity = selectedSizeObj ? Math.min(selectedSizeObj.stock,5) : 1

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError("Please select a size");
            return;
        }
        setSizeError("");

        if (isInCart) {
            navigate("/cart");
            return;
        }

        dispatch(addToCart({
            productId: product._id,
            quantity: selectedQuantity,
            size: selectedSize
        }));
    }

    const handleBuyNow = () => {
        if(!selectedSize){
            setSizeError("Please select a size");
            return;
        }
        setSizeError("");

        dispatch(addToCart({
            productId: product._id,
            quantity: selectedQuantity,
            size: selectedSize
        })).then(() => {
            navigate('/checkout/delivery-address')
        })
    }


    const isWishlisted = (productId) =>
        wishlist?.some(item => (item._id || item).toString() === productId.toString())

    const handleWishlist = (e, productId) => {
        e.stopPropagation()
        dispatch(toggleWishlist(productId))
    }
    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10'>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                        {product.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img?.url}
                                alt={img.name}
                                onClick={() => setActiveImage(index)}
                                className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20  object-cover rounded-xl overflow-hidden border-r-2 cursor-pointer border ${activeImage === index
                                    ? "border-gray-900 shadow-lg"
                                    : "border-gray-200 hover:border-gray-400"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex-1">
                        <img
                            src={product.images[activeImage]?.url || product.images?.[activeImage]}
                            alt='product'
                            className='w-full h-72 md:h-[450px] lg:h-[550px] object-cover rounded-2xl shadow-lg'
                        />
                    </div>
                </div>

                <div className='flex flex-col'>
                    <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1'>
                        {product.name}
                    </h1>

                    <p className='text-gray-500 mt-1.5 text-sm uppercase tracking-wide'>
                        {product.fitType || "Regular Fit"}
                    </p>

                    {/* Rating Placeholder */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">(128 reviews)</span>
                    </div>

                    <p className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2 text-gray-900">
                        ₹{product.price}
                    </p>

                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-2 py-2">
                            <h3 className="font-semibold text-gray-900">
                                Select Size :
                            </h3>
                            <button className='text-xs text-gray-500 hover:text-gray-900 transition-colors'>
                                Size Guide
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {uniqueSizes.map((sizeObject, index) => {
                                const isOutOfStock = sizeObject.stock === 0;
                                return (
                                    <button 
                                        key={index} 
                                        onClick={() => handleSizeSelect(sizeObject)} 
                                        disabled={isOutOfStock} 
                                        className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border-2 font-medium text-xs sm:text-sm rounded transition-all duration-200
                                        ${selectedSize === sizeObject.size
                                            ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                                        }
                                        ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}
                                `} >
                                        {sizeObject.size}
                                    </button>
                                )
                            })}
                        </div>

                        {selectedSizeObj && selectedSizeObj.stock > 0 && selectedSizeObj.stock <=2 && (
                            <p className='text-red-500 text-xs mt-2 font-medium'>
                                Only {selectedSizeObj.stock} left in stock!
                            </p>
                        )}

                        {sizeError && (
                            <p className='text-red-500 text-sm mt-2'>
                                {sizeError}
                            </p>
                        )}
                    </div>

                    {selectedSize && selectedSizeObj && selectedSizeObj.stock > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-900 mt-2">
                                Quantity:
                            </h3>

                            <div className="relative w-28">
                                <select
                                    value={selectedQuantity}
                                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                                    className='w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:border-gray-900 cursor-pointer transition-all'>
                                        {Array.from({length: maxQuantity}, (_,i) => i + 1).map(qty => (
                                            <option key={qty} value={qty}>{qty}</option>
                                        ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    )}


                    <div className="flex gap-2   mt-6">
                        <button onClick={handleAddToCart} className='flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg'>
                            {isInCart ? "Go To Cart" : "Add To Cart"}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200"
                        >
                            Buy Now
                        </button>

                        <button
                            onClick={(e) => handleWishlist(e, product._id)}
                            className="px-5 py-3 rounded-xl border-2 border-gray-200 font-semibold flex items-center justify-center gap-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400">
                            <Heart size={18} className={isWishlisted(product._id) ? 'fill-red-500 text-red-500' : ''} />
                        </button>
                    </div>



                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                            <div className="flex flex-col items-center text-center">
                                <Truck size={20} className="text-gray-600 mb-1" />
                                <p className="text-xs font-medium text-gray-900">Free Shipping</p>
                                <p className="text-xs font-medium text-gray-500">Shipping</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <RotateCcw size={20} className="text-gray-600 mb-1" />
                                <p className="text-xs font-medium text-gray-900">Easy Returns</p>
                                <p className="text-xs text-gray-500">7 days</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Shield size={20} className="text-gray-600 mb-1" />
                                <p className="text-xs font-medium text-gray-900">Secure</p>
                                <p className="text-xs text-gray-500">Payment</p>
                            </div>
                        </div>
                    </div>


                    <div className="mt-6 border-t border-gray-100">
                        <button
                            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                            className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
                        >
                            <h3 className='font-semibold text-gray-900'>Product Details</h3>
                            {isDetailsOpen ? (
                                <ChevronUp size={20} className="text-gray-500" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500" />
                            )}
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDetailsOpen ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0'
                            }`}>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.description || 'No description available.'}
                            </p>


                            {product.material && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        <span className="font-medium text-gray-700">Material:</span> {product.material}
                                    </p>
                                </div>
                            )}

                            {product.care && (
                                <p className="text-xs text-gray-500 mt-2">
                                    <span className="font-medium text-gray-700">Care:</span> {product.care}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900'>You may also like</h2>
                    {relatedProducts.length > 4 && (
                        <button
                            onClick={() => navigate(`/product/relatedproduct?subCategory=${product.subCategory?.slug || product.subCategory}&name=${product.subCategory?.name || ''}`)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            View All
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {relatedProducts.slice(0,4).map((product) => {

                        const hasDiscount = product.discountPercentage > 0 ||
                            (product.discountPrice && product.discountPrice < product.price)
                        const displayPrice = hasDiscount ? product.discountPrice : product.price
                        const originalPrice = hasDiscount ? product.price : null

                        return (
                            <motion.div
                                key={product._id}
                                whileHover={{ y: -4 }}
                                className="group min-w-55 lg:min-w-0 cursor-pointer"
                            >
                                <div
                                    className="aspect-3/4 relative overflow-hidden rounded-xl"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <img
                                        src={product.images?.[0]?.url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                                    />

                                    {product.images?.[1]?.url && (
                                        <img
                                            src={product.images?.[1]?.url}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                                        />
                                    )}

                                    <button
                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                                        onClick={(e) => handleWishlist(e, product._id)}
                                    >
                                        <Heart
                                            size={16}
                                            className={isWishlisted(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                                        />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <h3 className="text-sm text-[#585c70] font-semibold truncate border-b border-dashed border-gray-300 pb-0.5">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-[#737577] mt-1">
                                        {product.subCategory?.name}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-[#58595B] font-semibold">
                                            ₹{Math.round(displayPrice)}
                                        </p>
                                        {originalPrice && (
                                            <p className="text-xs text-gray-400 line-through">
                                                ₹{Math.round(originalPrice)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </motion.div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default ProductDetails
