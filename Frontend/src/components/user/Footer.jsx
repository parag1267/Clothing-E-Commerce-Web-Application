import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ShoppingBag } from 'lucide-react';


const Footer = () => {
  return (
    <footer className='bg-gray-100 text-gray-700'>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="text-blue-500">Cloth</span>
              <span className="text-black">Kart</span>
            </h1>
          </div>

          <p className='text-sm leading-6 text-gray-400'>
            Shop No. 11, Fashion Plzza,<br />
            AK Road, Andheri East,<br />
            Vesu, Surat - 395010
          </p>

          <p className='text-sm mt-3 space-y-1'>
            <a href='tel:+916356143218' className='block hover:text-blue-400 hover:underline'>+91 6356143218</a>
            <a href='mailto:clothkart@gmail.com' className='block hover:text-blue-400 hover:underline'>clothkart@gmail.com</a>
          </p>

          <p className='text-xs mt-4 text-gray-500'>
            Mon - Sat: 10 AM - 9 PM
          </p>
        </div>

        <div>
          <h3 className='text-blue-500 font-bold mb-4'>NEED HELP</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/track-order" className="hover:underline">Track Order</a></li>
            <li><a href="/return-refund" className="hover:underline">Returns & Refunds</a></li>
            <li><a href="/faqs" className="hover:underline">FAQS</a></li>
            <li><a href="/my-account" className="hover:underline">My Account</a></li>
          </ul>
        </div>

        <div>
          <h3 className='text-blue-500 font-bold mb-4'>COMPANY</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href="/about-us" className="hover:underline">About Us</a></li>
            <li><a href="/our-story" className="hover:underline">Our Story</a></li>
            <li><a href="/careers" className="hover:underline">Careers</a></li>
            <li><a href="/press" className="hover:underline">Press</a></li>
          </ul>
        </div>

        <div>
          <h3 className='text-blue-500 font-bold mb-4'>SHOP</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href="/men" className="hover:underline">Mens</a></li>
            <li><a href="/women" className="hover:underline">Women</a></li>
            <li><a href="/" className="hover:underline">New Arrivals</a></li>
            <li><a href="/" className="hover:underline">Best Sellers</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex gap-3">
            <a href="" target='_blank' rel='noopener noreferrer'
              className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 hover:bg-pink-500 transition-colors'>
              <FontAwesomeIcon icon={faInstagram} className='text-sm text-white' />
            </a>
            <a href="" target='_blank' rel='noopener noreferrer'
              className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600 transition-colors'>
              <FontAwesomeIcon icon={faFacebook} className='text-sm text-white' />
            </a>
            <a href="" target='_blank' rel='noopener noreferrer'
              className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 hover:bg-sky-500 transition-colors'>
              <FontAwesomeIcon icon={faTwitter} className='text-sm text-white' />
            </a>
            <a href="" target='_blank' rel='noopener noreferrer'
              className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 hover:bg-green-500 transition-colors'>
              <FontAwesomeIcon icon={faWhatsapp} className='text-sm text-white' />
            </a>
          </div>

          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} ClothKart. All Rights Reserved.
          </p>

        </div>
      </div>

    </footer>
  )
}

export default Footer
