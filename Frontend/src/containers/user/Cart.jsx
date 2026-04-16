import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, removeFromCart, updateCartItem } from '../../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Package, Plus, ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cart, loading } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const totalPrice = cart?.items?.reduce((acc, item) => {
        if (!item.product) return acc;
        return acc + item.product.price * item.quantity;
    }, 0) || 0;


    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShoppingCart size={36} className="text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 bg-linear-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='min-h-screen bg-gray-50 py-8 md:py-12'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="mb-6 md:mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                        <ShoppingCart size={20} className="text-white" />
                    </div>

                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>Shopping Cart</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {/* Left Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.product?._id + item.size}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-blue-100">

                                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 sm:p-5">
                                    <div className="w-full h-48 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-gray-100">
                                        <img
                                            src={item.product?.images?.[0]?.url}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between p-4 sm:p-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className='min-w-0'>
                                                <h3 className='font-bold text-base sm:text-lg text-gray-900 truncate'>
                                                    {item.product?.name}
                                                </h3>

                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className='text-xs text-gray-400'>Size:</span>
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                                        {item.size}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="text-base font-bold text-gray-900">
                                                    ₹{item.product?.price * item.quantity}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                    ₹{item.product?.price} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between lg:gap-2 mt-4 pt-3 border-t border-gray-100 sm:border-none sm:pt-0 sm:mt-2.5">
                                            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                                <button
                                                    type='button'
                                                    disabled={item.quantity === 1}
                                                    onClick={() => dispatch(updateCartItem({
                                                        productId: item.product._id,
                                                        size: item.size,
                                                        action: "dec"
                                                    }))}
                                                    className='px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed'>
                                                    <Minus size={14} />
                                                </button>

                                                <span className="w-10 text-center font-medium text-gray-900">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        if (item.quantity >= 5) return
                                                        dispatch(updateCartItem({
                                                            productId: item.product._id,
                                                            size: item.size,
                                                            action: "inc"
                                                        }))
                                                    }}
                                                    disabled={item.quantity >= 5}
                                                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors'>
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => dispatch(removeFromCart({
                                                    productId: item.product._id,
                                                    size: item.size
                                                }))}
                                                className='text-red-400 text-sm hover:text-red-600 transition-colors flex items-center gap-1'>

                                                <Trash2 size={14} />
                                                <span className="hidden sm:inline font-medium">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors mt-2"
                        >
                            <ArrowLeft size={16} />
                            Continue Shopping
                        </button>
                    </div>


                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Package size={16} className="text-white" />
                                </div>
                                <h2 className="font-bold text-gray-900">Order Summary</h2>
                            </div>


                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className='text-gray-600'>
                                        Items ({cart.items.length})
                                    </span>

                                    <span className="text-gray-900 font-medium">
                                        ₹{totalPrice}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>

                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Free
                                    </span>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">₹{totalPrice}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Incl. all taxes</p>
                                        </div>
                                    </div>
                                </div>


                                <button
                                    onClick={() => navigate('/checkout/delivery-address')}
                                    className='w-full bg-black text-white py-3.5 rounded-xl font-semibold
                                        hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg mt-2
                                        flex items-center justify-center gap-2'
                                >
                                    Place Order
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-100 mt-2">
                                    <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                    <span className="text-xs text-gray-400">100% Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
