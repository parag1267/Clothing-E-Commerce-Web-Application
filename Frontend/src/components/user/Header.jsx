import { Heart, Menu, Package, Search, ShoppingBag, ShoppingCart, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../features/auth/authSlice';
import { getWishlist } from '../../features/wishlist/wishlistSlice';
import { fetchCart } from '../../features/cart/cartSlice';
import axios from 'axios';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(getWishlist());
        dispatch(fetchCart())
    }, [])

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await axios.get(
                    'http://localhost:5000/api/products/search',
                    { params: { query: searchQuery } }
                )
                setSearchResults(res.data.products || [])
            } catch (error) {
                setSearchResults([])
            } finally {
                setSearchLoading(false);
            }
        }, 400)
        return () => clearTimeout(timer);
    }, [searchQuery])

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchFocused(false);
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const { cart } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { wishlist } = useSelector(state => state.wishlist);

    const totalItems = cart?.items?.reduce(
        (acc, item) => acc + item.quantity,
        0
    ) || 0;

    const totalWishlist = wishlist?.length || 0;

    const handleUserClick = () => {
        navigate(user ? '/profile' : '/login');
    };

    const handleSearchSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const query = searchQuery.trim();
        if (!query) return;

        const savedResults = [...searchResults];
        setSearchFocused(false);
        setSearchResults([]);
        setSearchQuery('');

        try {
            let results = savedResults

            if (results.length === 0) {
                const res = await axios.get(
                    'http://localhost:5000/api/products/search',
                    { params: { query } }
                );
                results = res.data.products || [];
            }

            if (results.length === 0) {
                navigate(`/products?search=${encodeURIComponent(query)}`);
                return;
            }

            const categoryCount = {};
            results.forEach(p => {
                const slug = p.category?.slug;
                if (slug) categoryCount[slug] = (categoryCount[slug] || 0) + 1;
            });

            const detectedCategory = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

            const filteredResults = detectedCategory
                ? results.filter(p => p.category?.slug === detectedCategory)
                : results;

            const detectedSubCategories = [
                ...new Set(
                    filteredResults.map(p => p.subCategory?.slug).filter(Boolean)
                )
            ];
            const params = new URLSearchParams();
            if (detectedCategory) params.set("category", detectedCategory);
            if (detectedSubCategories.length > 0) {
                params.set("sub", detectedSubCategories.join(","));
            }
            params.set("search", query);

            navigate(`/products?${params.toString()}`);
        } catch (error) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchFocused(false);
        setSearchResults([]);
        setSearchQuery('');
    }

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const showDropdown = searchFocused && searchQuery.trim().length >= 2;

    return (
        <>
            <header className='bg-[#F8FAFC] shadow-sm sticky top-0 z-40'>
                <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
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
                        <div ref={searchRef} className="hidden lg:block relative">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center rounded-full px-3 py-1.5 ring-1 cursor-text bg-gray-100 ring-transparent hover:bg-gray-200 w-60 border border-blue-500"
                            >
                                <Search
                                    size={16}
                                    className={`shrink-0 transition-colors duration-200 text-blue-500`}
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    placeholder='Search..'
                                    className='outline-none px-2 text-gray-800 text-sm bg-transparent w-full'
                                />
                                {searchQuery && (
                                    <X
                                        size={14}
                                        className="text-gray-600 cursor-pointer hover:text-gray-600 shrink-0"
                                        onClick={clearSearch}
                                    />
                                )}
                            </form>
                            {/* ── DROPDOWN ── */}
                            {showDropdown && (
                                <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                                    {/* Loading state */}
                                    {searchLoading ? (
                                        <div className="px-4 py-3 text-sm text-gray-400">
                                            Searching...
                                        </div>

                                    ) : searchResults.length === 0 ? (
                                        /* No results */
                                        <div className="px-4 py-3 text-sm text-gray-400">
                                            No results for "{searchQuery}"
                                        </div>

                                    ) : (
                                        <>
                                            {/* Group results by category */}
                                            {[...new Set(searchResults.map(p => p.subCategory?.name))].map(catName => (
                                                <div key={catName}>
                                                    {/* Category header */}
                                                    <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                                        {catName}
                                                    </p>
                                                    {/* Products under that category */}
                                                    {searchResults
                                                        .filter(p => p.subCategory?.name === catName)
                                                        .slice(0, 3)
                                                        .map(product => (
                                                            <div
                                                                key={product._id}
                                                                onClick={() => handleProductClick(product._id)}
                                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                                                            >
                                                                <img
                                                                    src={product.images?.[0]?.url}
                                                                    alt={product.name}
                                                                    className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                                        {product.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {product.subCategory?.name}
                                                                    </p>
                                                                </div>
                                                                <p className="text-sm font-semibold text-blue-500 shrink-0">
                                                                    ₹{product.price}
                                                                </p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ))}

                                            {/* View all results */}
                                            <div
                                                onClick={handleSearchSubmit}
                                                className="px-4 py-3 text-sm text-center text-blue-500 font-medium hover:bg-blue-50 cursor-pointer border-t border-gray-100 transition-colors"
                                            >
                                                View all results for "{searchQuery}"
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Track Order — lg+ only */}
                        <div
                            className="hidden lg:block relative cursor-pointer"
                            onClick={() => navigate('/track-order')}
                        >
                            <Package size={22} className='hover:text-blue-600 transition-colors text-blue-500' />
                        </div>

                        {/* Wishlist — always visible */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => navigate('/wishlist')}
                        >
                            <Heart
                                size={22}
                                className={`transition-colors ${totalWishlist > 0
                                    ? 'red-500 text-blue-500'
                                    : 'text-blue-600 hover:text-blue-700'}`}
                            />
                            {totalWishlist > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full font-medium">
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
                                    : 'text-blue-600 hover:text-blue-700'}`}
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
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold uppercase text-sm hover:bg-blue-700 transition">
                                        {user.fullname?.charAt(0) || "U"}
                                    </div>
                                )
                            ) : (
                                <User size={22} className='text-blue-600 hover:text-blue-700 transition-colors ' />
                            )}
                        </div>
                    </div>

                </div>

                <div className="lg:hidden px-4 py-2">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2"
                    >
                        <Search size={16} className='text-gray-400 shrink-0' />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            placeholder='Search for products...'
                            className='outline-none text-sm bg-transparent w-full text-gray-700 placeholder-gray-400'
                        />
                        {searchQuery && (
                            <X
                                size={14}
                                className="text-gray-400 cursor-pointer hover:text-gray-600 shrink-0"
                                onClick={clearSearch}
                            />
                        )}
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
