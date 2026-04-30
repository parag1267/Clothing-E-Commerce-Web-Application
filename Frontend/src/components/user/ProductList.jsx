import { Heart } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchTabs, setActiveTab } from '../../features/products/productSlice';
import { useNavigate } from 'react-router-dom';
import { getWishlist, toggleWishlist } from '../../features/wishlist/wishlistSlice';

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="aspect-3/4 bg-gray-200 rounded-xl" />
        <div className="mt-2 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-2/5" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
    </div>
)

// ─── Skeleton Tabs ────────────────────────────────────────────────────────────

const SkeletonTabs = () => (
    <div className="flex gap-2 overflow-x-auto py-3 md:py-4 scrollbar-hide animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full flex-shrink-0" />
        ))}
    </div>
)

const ProductList = ({ category }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tabs, products, activeTab, loading } = useSelector((state) => state.products);
    const { wishlist } = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (!category) return;
        dispatch(fetchTabs(category));
        dispatch(fetchProducts({ tab: "trending", category }));
        dispatch(getWishlist());
    }, [category, dispatch])

    useEffect(() => {
        if (tabs.length > 0 && !tabs.find(t => t.slug === activeTab)) {
            const firstValidTab = tabs.find(
                tab => tab.slug === "trending" || (tab.count || 0) > 0
            );

            if (firstValidTab) {
                dispatch(setActiveTab(firstValidTab.slug));
                dispatch(fetchProducts({ tab: firstValidTab.slug, category }));
            }
        }
    }, [tabs]);


    const handleTabClick = (tab) => {
        dispatch(setActiveTab(tab.slug));
        dispatch(fetchProducts({ tab: tab.slug, category }));
    }


    return (
        <section className="pb-8 md:pb-12 bg-white">
            <div className="sticky top-27.5 lg:top-15 z-30 bg-white border-b border-gray-100 px-2 md:px-6">
                <div className="flex gap-2 overflow-x-auto py-3 md:py-4 scrollbar-hide">
                    {tabs
                        .filter(tab => tab.slug === "trending" || (tab.count || 0) > 0)
                        .map((tab) => (
                            <button
                                key={tab.slug}
                                onClick={() => handleTabClick(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
          ${activeTab === tab.slug
                                        ? "bg-blue-500 text-white shadow-sm scale-[1.03]"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 px-2 md:px-6">

                {loading ? (
                    [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    products.map((item, index) => {
                        const isWishlisted = wishlist?.some(w => (w._id || w) === item._id)
                        const handleWishlist = (e) => {
                            e.stopPropagation()
                            dispatch(toggleWishlist(item._id))
                        }

                        const hasDiscount = item.discountPercentage > 0 ||
                            (item.discountPrice && item.discountPrice < item.price)
                        const displayPrice = hasDiscount ? item.discountPrice : item.price
                        const originalPrice = hasDiscount ? item.price : null

                        return (
                            <div key={item._id} className="group">
                                <div className="aspect-3/4 relative overflow-hidden group" onClick={() => navigate(`/product/${item._id}`, { state: item })}>
                                    <img
                                        src={item.images?.[0]?.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105" />

                                    {item.images?.[1]?.url && (
                                        <img
                                            src={item.images?.[1]?.url}
                                            alt={item.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" />
                                    )}

                                    <button
                                        className="absolute top-2 right-2 md:top-3 md:right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                                        onClick={handleWishlist}
                                    >
                                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <h3 className='text-xs md:text-sm text-[#585c70] font-semibold truncate border-b border-dashed border-gray-400 pb-0.5'>
                                        {item.name}
                                    </h3>

                                    <p className="text-xs md:text-sm text-[#737577] mt-1">
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
                    })
                )}
            </div>
        </section>
    )
}

export default ProductList
