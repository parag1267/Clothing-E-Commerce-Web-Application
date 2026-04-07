import { Heart, ShoppingCart } from 'lucide-react';
import React from 'react'

const products = [
    {
        id: 1,
        name: "Oversized Hoodie",
        price: 1499,
        oldPrice: 1999,
        rating: 4.5,
        reviews: 210,
        image1:
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
        image2:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    },
    {
        id: 2,
        name: "Streetwear T-Shirt",
        price: 999,
        oldPrice: 1299,
        rating: 4.3,
        reviews: 150,
        image1:
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
        image2:
            "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=800",
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 1799,
        oldPrice: 2299,
        rating: 4.7,
        reviews: 320,
        image1:
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
        image2:
            "https://images.unsplash.com/photo-1495121605193-b116b5b09a75?w=800",
    },
    {
        id: 4,
        name: "Minimal Sweatshirt",
        price: 1299,
        oldPrice: 1599,
        rating: 4.4,
        reviews: 180,
        image1:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
        image2:
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
    },
];

const BestSellers = () => {
    return (
        <section className='py-16 bg-gray-100'>
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                <div className="flex items-center justify-between mb-10">
                    <h2 className='text-2xl md:text-3xl font-bold'>
                        Best Sellers
                    </h2>

                    <button className='hidden md:block border px-5 py-2 rounded-full hover:bg-black hover:text-white transition'>
                        View All
                    </button>
                </div>

                <div className="flex lg:grid lg:grid-cols-4 gap-8 overflow-x-auto lg:overflow-visible pb-4">
                    {products.map((product) => (

                        <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">
                            <div className="relative overflow-hidden">
                                <img src={product.image} alt={product.name} className='h-48 sm:h-56 md:h-64 w-full object-cover group-hover:scale-105 transition duration-500' />

                                {product.sale && (
                                    <span className='absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded'>
                                        SALE
                                    </span>
                                )}

                                <button className='absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:text-red-500'>
                                    <Heart size={16} />
                                </button>

                            </div>

                            <div className="p-3 md:p-4">
                                <p className="text-xs md:text-sm text-gray-500">
                                    {product.category}
                                </p>

                                <h3 className="font-semibold text-sm md:text-base mt-1">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-2 mt-1">
                                    {product.oldPrice ? (
                                        <>
                                            <span className='text-black font-bold text-sm md:text-lg'>
                                                ₹{product.price}
                                            </span>

                                            <span className="text-gray-400 line-through text-xs md:text-sm">
                                                ₹{product.oldPrice}
                                            </span>
                                        </>
                                    ) : (
                                        <span className='font-bold text-black text-lg'>
                                            ₹{product.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>

            <div className="lg:hidden mt-4 text-center">
                <button className="border px-5 py-2 rounded-full hover:bg-black hover:text-white transition">
                    View More
                </button>
            </div>
        </section>
    )
}

export default BestSellers
