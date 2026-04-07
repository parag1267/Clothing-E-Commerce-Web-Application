import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoloTrending } from '../../features/products/productSlice';
import { useNavigate } from 'react-router-dom';

const TrendingPolo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { trendingPolo, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchPoloTrending())
    }, [dispatch])
    return (
        <section className="py-8 md:py-12 bg-gray-50">
            <h2 className='uppercase  text-center text-lg md:text-2xl lg:text-3xl font-semibold tracking-widest mb-4 md:mb-10'>
                What's trending in polos
            </h2>

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
        </section>
    )
}

export default TrendingPolo
