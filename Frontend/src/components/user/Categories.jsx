import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCategories } from '../../features/subcategories/subCategoriesSlice';
import { useNavigate } from 'react-router-dom';

const Categories = ({ categorySlug }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subCategories, loading } = useSelector(state => state.subCategory);

  useEffect(() => {
    dispatch(fetchSubCategories(categorySlug))
  }, [dispatch, categorySlug])

  const handleCategoryClick = (cate) => {
    console.log("Clicked Item 👉", cate);
    navigate(`/product-list?category=${cate.category?.slug}&sub=${cate.slug}`)
  }


  const grouped = [];

  for (let i = 0; i < subCategories.length; i += 4) {
    grouped.push(subCategories.slice(i, i + 4))
  }

  return (
    <section className='py-8 md:py-12'>
      <h2 className='text-center text-[28px] font-semibold mb-6 md:mb-10'>
        CATEGORIES
      </h2>

      <div className="lg:hidden px-4">

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".category-pagination"
          }}>

          {grouped.map((group, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-2 gap-4">
                {group.map((cate, index) => (
                  <div
                    key={cate._id}
                    onClick={() => {handleCategoryClick(cate)}
                    } className="group cursor-pointer">
                    <div className="overflow-hidden bg-gray-100">
                      <img src={cate.images?.url} alt={cate.name} className="w-full h-50 object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <p className='mt-1 text-sm tracking-widest text-gray-700'>
                      {cate.name}
                    </p>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}

        </Swiper>

        <div className="category-pagination mt-6 flex justify-center"></div>

      </div>

      <div className="hidden lg:grid grid-cols-4 gap-4 px-4">
        {
          subCategories.map((cate, index) => (
            <div key={cate._id} onClick={() => handleCategoryClick(cate)} className="group cursor-pointer">
              <div className="overflow-hidden bg-gray-100">
                <img src={cate.images?.url} alt={cate.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>

              <p className='mt-1 text-sm tracking-widest text-gray-700'>
                {cate.name}
              </p>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default Categories
