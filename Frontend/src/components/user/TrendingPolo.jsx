import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoloTrending } from '../../features/products/productSlice';
import { useNavigate } from 'react-router-dom';

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="aspect-3/4 rounded-xl bg-gray-200" />
        <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
        <div className="mt-1 h-3 w-1/2 bg-gray-200 rounded" />
        <div className="mt-1 h-3 w-1/3 bg-gray-200 rounded" />
    </div>
);

// ─── Skeleton Grid ────────────────────────────────────────────────────────────

const TrendingPoloSkeleton = () => (
    <div className="px-2 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    </div>
);

const TrendingPolo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { trendingPolo, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchPoloTrending())
    }, [dispatch])
    return (
        <section className="py-8 md:py-12 bg-gray-50">
            <div className="text-center mb-4 md:mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                    What's Trending in Polos
                </h2>

                <p className="text-gray-400 mt-3 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                    Fresh styles, top picks — just for you
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
                    <div className="h-0.75 w-8 bg-blue-500 rounded-full" />
                    <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
                </div>
            </div>

            {loading ? (
                <TrendingPoloSkeleton />
            ) : (
                <div className="px-2 md:px-6 relative">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={16}
                        grabCursor={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                slidesPerGroup: 2
                            },
                            768: {
                                slidesPerView: 3,
                                slidesPerGroup: 3
                            },
                            1024: {
                                slidesPerView: 4,
                                slidesPerGroup: 4
                            }
                        }}>

                        {trendingPolo.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div onClick={() => navigate(`/product/${item._id}`)} className="group cursor-pointer">
                                    <div className="bg-white aspect-3/4 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                                        <img src={item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>

                                    <div className="mt-2">
                                        <h3 className='font-semibold text-[#58595b] text-[11px] md:text-[14px] lg:border-b lg:border-dashed lg:pb-1 truncate'>
                                            {item.name}
                                        </h3>

                                        <p className='text-gray-500 text-xs mt-1'>
                                            {item.fitType}
                                        </p>

                                        <p className="font-semibold text-[12px] md:text-[14px] text-[#58595b] mt-1">
                                            ₹{item.price}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}

                    </Swiper>
                </div>
            )}
        </section>
    )
}

export default TrendingPolo
