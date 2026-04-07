import React from 'react'

const Blog = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className="bg-white py-16 px-6 text-center border-b">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Fashion Blog
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          Discover styling tips, latest trends, and outfit inspiration
          curated by our fashion experts.
        </p>
      </div>


      <div className="max-w-6xl mx-auto px-6 py-8">
        <input
          type="text"
          placeholder='Search blog..'
          className='w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-red-50 rounded-2xl p-6 md:p-8 md:flex items-center gap-8">
          <img
            src={featured_blog}
            alt="Featured Blog"
            className='md:w-1/2 h-72 object-cover rounded-xl'
          />

          <div>
            <span className='text-red-500 font-semibold uppercase text-sm'>
              Featured Post
            </span>
            <h2 className='text-2xl font-semibold mt-2 text-gray-900'>
              Featured: Ultimate street style Guide
            </h2>

            <p className='text-gray-600 mt-3'>
              Learn how to Create premium street-style outfits using
              simple wardrobe items
            </p>

            <button className='mt-5 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition'>
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl transition border border-gray-100">
          <img src={blog1} alt="Blog 1" className='h-56 w-full object-cover' />

          <div className="p-5">
            <p className='text-sm text-red-500 font-medium'>Jan 11, 2026</p>
            <h3 className='font-semibold text-lg mt-2 text-gray-900'>Top Summer Fashion Trends 2026</h3>
            <p className='text-gray-600 mt-2 text-sm'>
              Discover the hottest summer fashion styles for this year.
            </p>
            <button className='mt-4 text-red-500 font-medium hover:text-red-600'>
              Read More →
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl transition border border-gray-100">
          <img src={blog2} alt="Blog 2" className='h-56 w-full object-cover' />

          <div className="p-5">
            <p className='text-sm text-red-500 font-medium'>Jan 11, 2026</p>
            <h3 className='font-semibold text-lg mt-2 text-gray-900'>Top Summer Fashion Trends 2026</h3>
            <p className='text-gray-600 mt-2 text-sm'>
              Discover the hottest summer fashion styles for this year.
            </p>
            <button className='mt-4 text-red-500 font-medium hover:text-red-600'>
              Read More →
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl transition border border-gray-100">
          <img src={blog3} alt="Blog 3" className='h-56 w-full object-cover' />

          <div className="p-5">
            <p className='text-sm text-red-500 font-medium'>Jan 11, 2026</p>
            <h3 className='font-semibold text-lg mt-2 text-gray-900'>Top Summer Fashion Trends 2026</h3>
            <p className='text-gray-600 mt-2 text-sm'>
              Discover the hottest summer fashion styles for this year.
            </p>
            <button className='mt-4 text-red-500 font-medium hover:text-red-600'>
              Read More →
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-t py-16 text-center px-6">
        <h2 className='text-3xl font-semibold text-gray-900'>Join Our Fashion Newsletter</h2>
        <p className='text-gray-600 mt-3'>
          Get style tips & new arrivals updates weekly.
        </p>

        <div className="max-w-md mx-auto mt-6 flex">
          <input
            type="text"
            placeholder='Enter your email'
            className='flex-1 p-3 rounded-l-lg border border-gray-400 outline-none'
          />
          <button className='bg-red-500 text-white px-6 rounded-r-lg font-semibold hover:bg-red-600 transition'>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}

export default Blog
