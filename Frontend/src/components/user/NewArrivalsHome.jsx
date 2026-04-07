import { Heart, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../../features/products/productSlice';
import { getWishlist, toggleWishlist } from '../../features/wishlist/wishlistSlice';

const NewArrivalsHome = () => {
  const dispatch = useDispatch();
  const {wishlist} = useSelector(state => state.wishlist);

  const handleWishlist = (productId) => {
    console.log("Click button",productId)
    dispatch(toggleWishlist(productId));
  };

  const isWishlisted = (productId) => {
    return wishlist?.some(item => (item._id || item).toString() === productId.toString());
  }

  const { newArrivals, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchNewArrivals());
    dispatch(getWishlist());
  }, [dispatch]);

  const calculateDiscountPercentage = (price, discountPrice) => {
    if (!discountPrice || discountPrice >= price) return null;
    const discount = ((price - discountPrice) / price) * 100;
    return Math.round(discount);
  }

  return (
    <div className='bg-gray-50'>
      <section className='max-w-7xl mx-auto px-4 md:px-6 py-20'>
        <div className="flex flex-col sm:flex-row items-center md:justify-between mb-10 text-center sm:text-left gap-2 md:gap-4">
          <div>
            <h2 className='text-3xl md:text-4xl font-bold'>
              New Arrivals
            </h2>

            <p className='text-gray-500 mt-1'>
              Discover our latest fashion collection
            </p>
          </div>

          <button className="hidden lg:block border px-5 py-2 rounded-full hover:bg-black hover:text-white transition">
            View More
          </button>


        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {newArrivals.map((product) => {
            const hasDiscount = product.discountPercentage > 0 ||
              (product.discountPrice && product.discountPrice < product.price);
            const displayPrice = hasDiscount ? product.discountPrice : product.price;
            const originalPrice = hasDiscount ? product.price : null;
            const discountPercent = product.discountPercentage || calculateDiscountPercentage(product.price, product.discountPrice)

            return (
              <div key={product._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 relative">
                <div className="relative overflow-hidden">
                  <img src={product.images?.[0]?.url} alt={product.name} className='h-48 sm:h-56 md:h-64 w-full object-cover group-hover:scale-105 transition duration-500' />

                  {hasDiscount && (
                    <span className='absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded'>
                      {discountPercent}% OFF
                    </span>
                  )}

                  <button onClick={() => handleWishlist(product._id)} className='absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:text-red-500'>
                    <Heart size={16} className={`transition ${isWishlisted(product._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}  />
                  </button>

                </div>

                <div className="p-3 md:p-4 pb-12">
                  <p className="text-xs md:text-sm text-gray-500">
                    {product.category?.name}
                  </p>

                  <h3 className="font-semibold text-sm md:text-base mt-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className='text-black font-bold text-sm md:text-lg'>
                      ₹{Math.round(displayPrice)}
                    </span>

                    {originalPrice && (
                      <span className="text-gray-400 line-through text-xs md:text-sm">
                        ₹{Math.round(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button className="absolute -bottom-1 -right-1 bg-black text-white p-3 rounded-xl shadow hover:bg-gray-800 transition">
                  <ShoppingCart size={18} />
                </button>
              </div>
            )
          })}
        </div>
        <div className="lg:hidden mt-4 text-center">
          <button className="border px-5 py-2 rounded-full hover:bg-black hover:text-white transition">
            View More
          </button>
        </div>
      </section>
    </div>
  )
}

export default NewArrivalsHome
