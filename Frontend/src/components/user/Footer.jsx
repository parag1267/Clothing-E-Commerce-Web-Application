import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";


const Footer = () => {
  return (
    <footer className='bg-gray-100 text-gray-700'>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className='text-red-500 font-bold mb-4'>OUR STORE</h3>
          <p className='text-sm leading-6'>
            Creative LifeStyle<br />
            Shop No. 11, Fashion Plzza,<br />
            AK Road, Andheri East,<br />
            Vesu, Surat - 395010
          </p>

          <p className='text-sm mt-3 space-y-1'>
            <a href='tel:+916356143218' className='block hover:underline'>+91 6356143218</a>
            <a href='mailto:creativelifestyle@gmail.com' className='block hover:underline'>creativelifestyle@gmail.com</a>
          </p>

          <p className='text-sm mt-3'>
            Mon - Sat: 10 AM - 9 PM
          </p>
        </div>

        <div>
          <h3 className='text-red-500 font-bold mb-4'>NEED HELP</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/track-order" className="hover:underline">Track Order</a></li>
            <li><a href="/return-refund" className="hover:underline">Returns & Refunds</a></li>
            <li><a href="/faqs" className="hover:underline">FAQS</a></li>
            <li><a href="/my-account" className="hover:underline">My Account</a></li>
          </ul>
        </div>

        <div>
          <h3 className='text-red-500 font-bold mb-4'>COMPANY</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href="/about-us" className="hover:underline">About Us</a></li>
            <li><a href="/our-story" className="hover:underline">Our Story</a></li>
            <li><a href="/careers" className="hover:underline">Careers</a></li>
            <li><a href="/press" className="hover:underline">Press</a></li>
          </ul>
        </div>

        <div>
          <h3 className='text-red-500 font-bold mb-4'>SHOP</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href="/mens" className="hover:underline">Mens</a></li>
            <li><a href="/women" className="hover:underline">Women</a></li>
            <li><a href="/new-arrivals" className="hover:underline">New Arrivals</a></li>
            <li><a href="/best-sellers" className="hover:underline">Best Sellers</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto p-4 flex justify-center md:justify-center gap-4 pb-4">
        <a
          href=""
          target='_blank'
          rel='noopener noreferrer'
          className='w-10 h-10 flex items-center justify-center rounded-full border bg-blue-400 transition'
        >
          <FontAwesomeIcon icon={faInstagram} className='text-xl text-white' />
        </a>

        <a
          href=""
          target='_blank'
          rel='noopener noreferrer'
          className='w-10 h-10 flex items-center justify-center rounded-full border bg-pink-400 transition'
        >
          <FontAwesomeIcon icon={faFacebook} className='text-xl text-white' />

        </a>

        <a
          href=""
          target='_blank'
          rel='noopener noreferrer'
          className='w-10 h-10 flex items-center justify-center rounded-full border bg-amber-400 transition'
        >
          <FontAwesomeIcon icon={faTwitter} className='text-xl text-white' />
        </a>

        <a
          href=""
          target='_blank'
          rel='noopener noreferrer'
          className='w-10 h-10 flex items-center justify-center rounded-full border bg-black transition'
        >
          <FontAwesomeIcon icon={faWhatsapp} className='text-xl text-white' />
        </a>
      </div>

      <div className="max-w-6xl mx-auto border-t border-dashed">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <h4>&copy; {new Date().getFullYear()} - {new Date().getFullYear() + 1} Creative Lifestyle. All Rights Reserved.</h4>
        </div>
      </div>
    </footer>
  )
}

export default Footer
