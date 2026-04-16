import { Heart, Menu, Package, Search, ShoppingBag, ShoppingCart, User, X } from 'lucide-react';
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
        if (user) {
            navigate('/profile')
        }
        else {
            navigate('/login')
        }
    }

    return (
        <>
            <header className='bg-[#F8FAFC] shadow-sm sticky top-0 z-40'>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            className='lg:hidden text-gray-700 p-1'
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>

                        <div
                            className="flex items-center gap-1.5 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-7 h-7 bg-blue-500 rounded-lg items-center justify-center hidden lg:flex">
                                <ShoppingBag size={16} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold">
                                <span className="text-blue-500">Cloth</span>
                                <span className="text-gray-900">Kart</span>
                            </h1>
                        </div>
                    </div>

                    <nav className='hidden lg:flex gap-8 font-medium'>
                        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
                        <NavLink to="/men" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Men</NavLink>
                        <NavLink to="/women" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Women</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
                    </nav>

                    <div className="flex items-center gap-4">

                        {/* Search — lg+ only */}
                        <form className="hidden lg:flex items-center bg-gray-100 rounded-full px-3 py-1.5 focus-within:bg-white focus-within:border focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <Search size={16} className='text-gray-400' />
                            <input
                                type="text"
                                placeholder='Search..'
                                className='outline-none px-2 text-sm w-36 lg:w-48 bg-transparent'
                            />
                        </form>

                        {/* Track Order — lg+ only */}
                        <div
                            className="hidden lg:block relative cursor-pointer"
                            onClick={() => navigate('/track-order')}
                        >
                            <Package size={22} className='hover:text-blue-500 transition-colors text-gray-600' />
                        </div>

                        {/* Wishlist — always visible */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => navigate('/wishlist')}
                        >
                            <Heart
                                size={22}
                                className={`transition-colors ${totalWishlist > 0
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-600 hover:text-red-500'}`}
                            />
                            {totalWishlist > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full font-medium">
                                    {totalWishlist}
                                </span>
                            )}
                        </div>

                        {/* Cart — always visible */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => navigate('/cart')}
                        >
                            <ShoppingCart
                                size={22}
                                className={`transition-colors ${totalItems > 0
                                    ? 'text-blue-500'
                                    : 'text-gray-600 hover:text-blue-500'}`}
                            />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full font-medium">
                                    {totalItems}
                                </span>
                            )}
                        </div>

                        {/* User — lg+ only */}
                        <div className="hidden lg:block cursor-pointer" onClick={handleUserClick}>
                            {user ? (
                                user?.profileImage?.url ? (
                                    <img
                                        src={user.profileImage.url}
                                        alt="profile"
                                        className='w-8 h-8 rounded-full object-cover hover:scale-105 transition'
                                    />
                                ) : (
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold uppercase text-sm hover:bg-red-600 transition">
                                        {user.fullname?.charAt(0) || "U"}
                                    </div>
                                )
                            ) : (
                                <User size={22} className='hover:text-blue-500 transition-colors text-gray-600' />
                            )}
                        </div>
                    </div>

                </div>

                <div className="lg:hidden px-4 py-3">
                    <form className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
                        <Search size={16} className='text-gray-400 shrink-0' />
                        <input
                            type="text"
                            placeholder='Search for products...'
                            className='outline-none text-sm bg-transparent w-full text-gray-700 placeholder-gray-400'
                        />
                    </form>
                </div>
            </header>

            {
                menuOpen && (
                    <div
                        className='lg:hidden fixed inset-0 z-50'
                        onClick={() => setMenuOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/40" />

                        <div
                            className='absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col'
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <div
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => { navigate('/'); setMenuOpen(false); }}
                                >
                                    <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <ShoppingBag size={14} className="text-white" />
                                    </div>
                                    <h1 className="text-lg font-bold">
                                        <span className="text-blue-500">Cloth</span>
                                        <span className="text-gray-900">Kart</span>
                                    </h1>
                                </div>
                                <button onClick={() => setMenuOpen(false)}>
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div
                                className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => { handleUserClick(); setMenuOpen(false); }}
                            >
                                {user ? (
                                    <>
                                        {user?.profileImage?.url ? (
                                            <img
                                                src={user.profileImage.url}
                                                alt="profile"
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white font-semibold uppercase">
                                                {user.fullname?.charAt(0) || "U"}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{user.fullname}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                            <User size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Login / Register</p>
                                            <p className="text-xs text-gray-500">Access your account</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <nav className='flex flex-col py-2 flex-1'>
                                {[
                                    { to: "/", label: "Home" },
                                    { to: "/men", label: "Men" },
                                    { to: "/women", label: "Women" },
                                    { to: "/contact", label: "Contact" },
                                    { to: "/track-order", label: "Track Order" },
                                ].map(({ to, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 ${isActive
                                                ? 'text-blue-500 bg-blue-50'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
        </>
    )
}

export default Header
