import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import slider1Mobile from '../../assets/Images/women-slider/mobile-image/mobile1.jpg'
import slider2Mobile from '../../assets/Images/women-slider/mobile-image/mobile2.jpg'
import slider3Mobile from '../../assets/Images/women-slider/mobile-image/mobile3.jpg'
import slider4Mobile from '../../assets/Images/women-slider/mobile-image/mobile4.jpg'

import slider1Lg from '../../assets/Images/women-slider/lg-image/lg1.jpg'
import slider2Lg from '../../assets/Images/women-slider/lg-image/lg2.jpg'
import slider3Lg from '../../assets/Images/women-slider/lg-image/lg3.jpg'
import slider4Lg from '../../assets/Images/women-slider/lg-image/lg4.jpg'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const WomenSlider = () => {
    const slides = [
        {
            id: 1,
            mobile: slider1Mobile,
            desktop: slider1Lg,
            alt: "Women Fashion 1",
        },
        {
            id: 2,
            mobile: slider2Mobile,
            desktop: slider2Lg,
            alt: "Women Fashion 2",
        },
        {
            id: 3,
            mobile: slider3Mobile,
            desktop: slider3Lg,
            alt: "Women Fashion 3",
        },
        {
            id: 4,
            mobile: slider4Mobile,
            desktop: slider4Lg,
            alt: "Women Fashion 4",
        }
    ];
    return (
        <div className="w-full relative">
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{
                    dynamicBullets: true,
                    clickable: true,
                }}
                navigation={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={true}
                className="w-full h-auto 
                                [&_.swiper-pagination-bullet]:bg-gray-400!        
                                [&_.swiper-pagination-bullet-active]:bg-black!
                                [&_.swiper-pagination]:bottom-2 lg:[&_.swiper-pagination]:bottom-6"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full">
                            {/* Mobile image */}
                            <img
                                src={slide.mobile}
                                alt={slide.alt}
                                className="w-full h-auto block lg:hidden"
                            />
                            {/* Desktop image */}
                            <img
                                src={slide.desktop}
                                alt={slide.alt}
                                className="w-full h-auto hidden lg:block"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>


        </div>
    )
}

export default WomenSlider
