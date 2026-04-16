import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchNewArrivals } from '../../features/products/productSlice'
import { getWishlist, toggleWishlist } from '../../features/wishlist/wishlistSlice'
import { Heart } from 'lucide-react'

const NewArrivals = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { newArrivals, loading, totalPages, currentPage } = useSelector(s => s.products)
    const { wishlist } = useSelector(s => s.wishlist)

    useEffect(() => {
        dispatch(fetchNewArrivals({ page: 1, limit: 40 }))
        dispatch(getWishlist())
    }, [dispatch])

    const isWishlisted = (productId) =>
        wishlist?.some(item => (item._id || item).toString() === productId.toString())

    const handleWishlist = (e, productId) => {
        e.stopPropagation()
        dispatch(toggleWishlist(productId))
    }

    const handleLoadMore = () => {
        dispatch(fetchNewArrivals({page: currentPage + 1,limit:40}))
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h1>
                <p className="text-gray-500 mt-1">Discover our latest fashion collection</p>
            </div>

            {loading && newArrivals.length === 0 ? (
                <p className="text-center text-gray-400 py-20">Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                        {newArrivals.map((item) => {

                            const hasDiscount = item.discountPercentage > 0 ||
                                (item.discountPrice && item.discountPrice < item.price)
                            const displayPrice = hasDiscount ? item.discountPrice : item.price
                            const originalPrice = hasDiscount ? item.price : null

                            return (
                                <div key={item._id} className="group cursor-pointer">

                                    <div
                                        className="aspect-3/4 relative overflow-hidden rounded-xl"
                                        onClick={() => navigate(`/product/${item._id}`, { state: item })}
                                    >
                                        <img
                                            src={item.images?.[0]?.url}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                                        />

                                        {item.images?.[1]?.url && (
                                            <img
                                                src={item.images?.[1]?.url}
                                                alt={item.name}
                                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                                            />
                                        )}

                                        {hasDiscount && (
                                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                                ₹{Math.round(originalPrice - displayPrice)} OFF
                                            </span>
                                        )}

                                        <button
                                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                                            onClick={(e) => handleWishlist(e, item._id)}
                                        >
                                            <Heart
                                                size={16}
                                                className={isWishlisted(item._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                                            />
                                        </button>
                                    </div>

                                    <div className="mt-2">
                                        <h3 className="text-sm text-[#585c70] font-semibold truncate border-b border-dashed border-gray-300 pb-0.5">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm text-[#737577] mt-1">
                                            {item.subCategory?.name}
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

                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-10 flex flex-col items-center gap-4">

                        {currentPage < totalPages && (
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-10 py-3 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : (
                                    `Load More  (Page ${currentPage + 1} / ${totalPages})`
                                )}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default NewArrivals