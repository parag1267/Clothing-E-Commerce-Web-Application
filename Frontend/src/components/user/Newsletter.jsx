import React from 'react'

const Newsletter = () => {
  return (
    <section className='bg-black text-white py-20'>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Join Our Newsletter
        </h2>

        <p className='text-gray-300 mb-8'>
          Subscribe to get updates on new arrivals, special offers and fashion trends.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input 
          type="email" 
          placeholder='Enter your email address'
          className='px-5 py-3 rounded-lg w-full sm:w-80 text-black bg-white outline-none'
          />

          <button className='bg-red-500 px-6 py-3 rounded-lg hover:bg-red-600 transition'>
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
