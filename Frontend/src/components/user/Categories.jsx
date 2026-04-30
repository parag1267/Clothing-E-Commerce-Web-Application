import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCategories } from '../../features/subcategories/subCategoriesSlice';
import { useNavigate } from 'react-router-dom';

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full h-50 lg:h-80 bg-gray-200 rounded" />
    <div className="mt-2 h-3 w-2/3 bg-gray-200 rounded" />
  </div>
);

// ─── Skeleton Mobile (2-col grid) ─────────────────────────────────────────────────

const SkeletonMobile = () => (
  <div className="lg:hidden px-4">
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} imgClass="h-50" />
      ))}
    </div>
  </div>
);

// ─── Skeleton Desktop (4-col grid) ────────────────────────────────────────────────

const SkeletonDesktop = () => (
  <div className="hidden lg:grid grid-cols-4 gap-4 px-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} imgClass="h-80" />
    ))}
  </div>
);

const Categories = ({ categorySlug }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subCategories, loading } = useSelector(state => state.subCategory);

  useEffect(() => {
    dispatch(fetchSubCategories(categorySlug))
  }, [dispatch, categorySlug])

  const handleCategoryClick = (cate) => {
    navigate(`/product-list?category=${cate.category?.slug}&sub=${cate.slug}`)
  }


  const grouped = [];

  for (let i = 0; i < subCategories.length; i += 4) {
    grouped.push(subCategories.slice(i, i + 4))
  }

  return (
    <section className='py-8 md:py-12'>
      {/* Section Heading */}
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
          Categories
        </h2>

        <p className="text-gray-400 mt-3 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
          Find your perfect style, all in one place
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
          <div className="h-0.75 w-8 bg-blue-500 rounded-full" />
          <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
        </div>
      </div>


      {loading ? (
        <>
          <SkeletonMobile />
          <SkeletonDesktop />
        </>
      ) : (
        <>
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
                        onClick={() => { handleCategoryClick(cate) }
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
        </>
      )}
    </section>
  )
}

export default Categories
