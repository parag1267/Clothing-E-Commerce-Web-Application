import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import slider1MobileMen from '../../assets/Images/men-slider/mobile-image/mobile1.jpg'
import slider1MobileWomen from '../../assets/Images/women-slider/mobile-image/mobile1.jpg'


import slider2MobileMen from '../../assets/Images/men-slider/mobile-image/mobile2.jpg'
import slider2MobileWomen from '../../assets/Images/women-slider/mobile-image/mobile2.jpg'

import slider3MobileMen from '../../assets/Images/men-slider/mobile-image/mobile3.jpg'
import slider3MobileWomen from '../../assets/Images/women-slider/mobile-image/mobile3.jpg'

import slider4MobileMen from '../../assets/Images/men-slider/mobile-image/mobile4.jpg'
import slider4MobileWomen from '../../assets/Images/women-slider/mobile-image/mobile4.jpg'


import slider1LgMen from '../../assets/Images/men-slider/lg-image/lg1.jpg'
import slider1LgWomen from '../../assets/Images/women-slider/lg-image/lg1.jpg'

import slider2LgMen from '../../assets/Images/men-slider/lg-image/lg2.jpg'
import slider2LgWomen from '../../assets/Images/women-slider/lg-image/lg2.jpg'

import slider3LgMen from '../../assets/Images/men-slider/lg-image/lg3.jpg'
import slider3LgWomen from '../../assets/Images/women-slider/lg-image/lg3.jpg'

import slider4LgMen from '../../assets/Images/men-slider/lg-image/lg4.jpg'
import slider4LgWomen from '../../assets/Images/women-slider/lg-image/lg4.jpg'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
const HomeSlider = () => {
    const slides = [
        {
            id: 1,
            mobile: slider1MobileMen,
            desktop: slider1LgMen,
            alt: "Men Fashion 1",
        },
        {
            id: 2,
            mobile: slider1MobileMen,
            desktop: slider1LgMen,
            alt: "Women Fashion 1",
        },
        {
            id: 3,
            mobile: slider2MobileMen,
            desktop: slider2LgMen,
            alt: "Men Fashion 2",
        },
        {
            id: 4,
            mobile: slider2MobileWomen,
            desktop: slider2LgWomen,
            alt: "Women Fashion 2",
        },
        {
            id: 5,
            mobile: slider3MobileMen,
            desktop: slider3LgMen,
            alt: "Men Fashion 3",
        },
        {
            id: 6,
            mobile: slider3MobileWomen,
            desktop: slider3LgWomen,
            alt: "Women Fashion 3",
        },
        {
            id: 7,
            mobile: slider4MobileMen,
            desktop: slider4LgMen,
            alt: "Men Fashion 4",
        },
        {
            id: 8,
            mobile: slider4MobileWomen,
            desktop: slider4LgWomen,
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

export default HomeSlider
