import React from 'react'
import { NavLink } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
    link: "/category/men",
  },
  {
    id: 2,
    name: "Women",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    link: "/category/women",
  },
];

const ShopByCategory = () => {
  return (
    <section className='bg-gray-50 py-11 md:py-20'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-14">
                <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold'>
                    Shop by Category
                </h2>

                <p className='text-gray-500 mt-2 text-sm md:text-base'>
                    Discover fashion tailored for you
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {categories.map((category) => (
                    <NavLink to="/men" key={category.id} className='group relative overflow-hidden rounded-xl md:rounded-2xl'>
                        <img src={category.image} alt={category.name} className='h-75 sm:h-90 md:h-105 w-full object-cover transition duration-700 group-hover:scale-110' />

                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg md:rounded-xl p-4 sm:p-5 md:p-6 transform transition duration-500 group-hover:-translate-y-2">
                            <h3 className='text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2'>
                                {category.name}
                            </h3>

                            <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3">
                                Explore the latest {category.name} collection
                            </p>

                            <span className="inline-block text-white border border-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm group-hover:bg-white group-hover:text-black transition">
                                Shop Now
                            </span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    </section>
  )
}

export default ShopByCategory
