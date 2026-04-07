import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../features/auth/authSlice';
import { getWishlist } from '../../features/wishlist/wishlistSlice';
import { fetchCart } from '../../features/cart/cartSlice';

const Header = () => {
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(getWishlist());
        dispatch(fetchCart())
    }, [dispatch])

    const { cart } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { wishlist } = useSelector(state => state.wishlist);

    const totalItems = cart?.items?.reduce(
        (acc, item) => acc + item.quantity,
        0
    ) || 0;

    const totalWishlist = wishlist?.length || 0;

    const handleUserClick = () => {
        if(user){
            navigate('/profile')
        }
        else {
            navigate('/login')
        }
    }

    return (
        <header className='bg-[#F8FAFC] shadow-sm sticky top-0 z-50'>
            <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className='text-2xl font-bold text-red-500 cursor-pointer hover:text-red-600 transition-colors' onClick={() => navigate('/')}>
                    Creative Lifestyle
                </h1>

                <nav className='hidden md:flex gap-8 font-medium'>
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
                    <NavLink to="/men" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Men</NavLink>
                    <NavLink to="/women" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Women</NavLink>
                    <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Blog</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>

                </nav>

                <div className="hidden md:flex items-center gap-5">
                    <form className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">

                        <Search size={18} className='text-gray-400' />
                        <input type="text" placeholder='Search..' className='outline-none px-2 text-sm w-32 lg:w-48 bg-transparent' />

                    </form>

                    <div className="relative cursor-pointer" onClick={() => navigate('/wishlist')}>
                        <Heart className='hover:text-red-500 transition-colors text-gray-600' />
                        {totalWishlist > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {totalWishlist}
                            </span>
                        )}
                    </div>

                    <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                        <ShoppingCart className='hover:text-red-500 transition-colors text-gray-600' />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>

                    <div onClick={handleUserClick}>
                        {user ? (
                            user?.profileImage?.url ? (
                                <img src={user.profileImage.url} alt="profile"
                                className='w-9 h-9 rounded-full object-cover cursor-pointer hover:scale-105 transition' />
                            ) : (
                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white font-semibold uppercase cursor-pointer hover:bg-red-600 transition">
                                {user.fullname?.charAt(0) || "U"}
                            </div>
                            )
                        ) : (
                            <User
                                className='cursor-pointer hover:text-red-500 transition-colors text-gray-600'
                                onClick={() => navigate('/login')} />
                        )}
                    </div>
                </div>

                <button className='md:hidden text-gray-700' onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <div className='md:hidden bg-white border-t'>
                    <nav className='flex flex-col gap-4 p-4'>
                        <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
                        <NavLink to="/men" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>Shop</NavLink>
                        <NavLink to="/women" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>Categories</NavLink>
                        <NavLink to="/blog" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>Blog</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header
