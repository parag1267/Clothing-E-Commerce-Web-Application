import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSingleProduct } from '../../features/products/productSlice';
import { ChevronDown, ChevronUp, Heart, RotateCcw, Shield, Star, Truck } from 'lucide-react';
import { addToCart, fetchCart } from '../../features/cart/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { product, loading } = useSelector((state) => state.products);
    const { cart } = useSelector((state) => state.cart);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [sizeError, setSizeError] = useState("");

    useEffect(() => {
        dispatch(fetchSingleProduct(id))
    }, [id, dispatch]);

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
            quantity: 1,
            size: selectedSize
        }));
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
                                    <button key={index} onClick={() => !isOutOfStock && setSelectedSize(sizeObject.size)} disabled={isOutOfStock} className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border-2 font-medium text-xs sm:text-sm rounded transition-all duration-200
                                    ${selectedSize === sizeObject.size
                                            ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                                        }
                                    ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}
                                `} >
                                        {sizeObject.size}
                                    </button>
                                )
                            })}
                        </div>

                        {selectedSize && (() => {
                            const selected = uniqueSizes.find(s => s.size === selectedSize);
                            if (!selected) return null;
                            if (selected.stock === 0) {
                                return (
                                    <p className="text-red-500 text-xs mt-2">
                                        Out of stock
                                    </p>
                                )
                            }

                            if (selected.stock <= 2) {
                                return (
                                    <p className='text-red-500 text-xs mt-2'>
                                        Only {selected.stock} left
                                    </p>
                                )
                            }
                            return null;
                        })()}

                        {sizeError && (
                            <p className='text-red-500 text-sm mt-2'>
                                {sizeError}
                            </p>
                        )}
                    </div>



                    <div className="flex flex-col sm:flex-row gap-2 mt-6">
                        <button onClick={handleAddToCart} className='flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg'>
                            {isInCart ? "Go To Cart" : "Add To Cart"}
                        </button>

                        <button className="px-5 py-3 rounded-xl border-2 border-gray-200 font-semibold flex-1 flex items-center justify-center gap-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400">
                            <Heart size={18} />
                            <span>Wishlist</span>
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
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                            <div className="overflow-hidden rounded-xl bg-gray-100">
                                <img
                                    src="https://images.unsplash.com/photo-1520975916090-3105956dac38"
                                    alt="related"
                                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-3 group-hover:text-gray-600 transition-colors">
                                Black T-shirt
                            </p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                ₹799
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ProductDetails
