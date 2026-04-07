import React from 'react'

const Contact = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className="bg-white text-black py-16 px-6 text-center">
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900'>Contact Us</h1>
        <p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
          Have questions about our Clothing, orders, or returns?
          Our team is here to help you anytime.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className='font-semibold text-lg'>📍 Address</h3>
          <p className='text-gray-600 mt-2'>
            Creative LifeStyle<br />
            Shop No. 11, Fashion Plzza,<br />
            AK Road, Andheri East,<br />
            Vesu, Surat - 395010
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className='font-semibold text-lg'>📞 Phone</h3>
          <p className='text-gray-600 mt-2'>
            +91 6356143218<br />
            +91 9737712612
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className='font-semibold text-lg'>✉ Email</h3>
          <p className='text-gray-600 mt-2'>
            creativelifestyle@gmail.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-10">
        <div className="bg-white shadow rounded-xl p-8">
          <h2 className='text-2xl font-semibold mb-6'>
            Send us a message
          </h2>

          <form className='space-y-5'>
            <input
            type="text"
            placeholder='Your Name'
            className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black' />

            <input
            type="email"
            placeholder='Your Email'
            className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black' />

            <input
            type="tel"
            placeholder='Phone Number'
            className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black' />

            <textarea
            placeholder='Your Message'
            rows='4'
            className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
            />

            <button className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition'>
              Send Message
            </button>
          </form>
        </div>

        <div className="rounded-xl overflow-hidden shadow">
          <iframe 
          title='map'
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14880.237854371087!2d72.85362279840352!3d21.189796637998903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fb09f6e05d5%3A0x7f1297a24491d240!2sParvat%20Patiya%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1771043201161!5m2!1sen!2sin"
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          className='w-full h-full min-h-[400px] border-0'></iframe>
        </div>
      </div>
    </div>
  )
}

export default Contact
