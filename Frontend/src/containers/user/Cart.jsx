import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, removeFromCart, updateCartItem } from '../../features/cart/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();

    const { cart, loading } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const totalPrice = cart?.items?.reduce((acc, item) => {
        if(!item.product) return acc;
        return acc + item.product.price * item.quantity;
    }, 0) || 0;

   
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="inline-flex items-center gap-2 bg-linear-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12'>
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="mb-8">
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                        Shopping Cart
                    </h1>

                    <p className="text-gray-500">
                        {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in your card
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.product?._id + item.size}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">

                                <div className="flex flex-col sm:flex-row gap-4 p-5">
                                    <div className="relative w-full sm:w-28 h-28 shrink-0">
                                        <img
                                            src={item.product?.images?.[0]?.url}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div>
                                                <h3 className='font-bold text-lg text-gray-900 mb-1'>
                                                    {item.product?.name}
                                                </h3>

                                                <p className='text-2xl font-bold text-gray-900'>
                                                    ₹{item.product?.price}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Subtotal
                                                </p>

                                                <p className="text-xl font-bold text-gray-900">
                                                    ₹{item.product?.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-2 mt-2 mb-3">
                                            <span className='text-sm text-gray-500'>Size:</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {item.size}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                                                <button
                                                    type='button'
                                                    disabled={item.quantity === 1}
                                                    onClick={() => dispatch(updateCartItem({
                                                        productId: item.product._id,
                                                        size: item.size,
                                                        action: "dec"
                                                    }))}
                                                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed'>
                                                    -
                                                </button>

                                                <span className="w-12 text-center font-medium text-gray-900">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type='button'
                                                    onClick={() => dispatch(updateCartItem({
                                                        productId: item.product._id,
                                                        size: item.size,
                                                        action: "inc"
                                                    }))}
                                                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors'>
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => dispatch(removeFromCart({
                                                    productId: item.product._id,
                                                    size: item.size
                                                }))}
                                                className='text-red-500 text-sm hover:text-red-700 transition-colors flex items-center gap-1'>

                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Order Summary
                                </h2>
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

                                <div className="border-t border-gray-200 my-4"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total
                                    </span>

                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ₹{totalPrice}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Inclusive of all taxes
                                        </p>
                                    </div>
                                </div>

                                <button className='w-full bg-linear-to-r from-black to-gray-800 text-white py-3.5 rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg mt-4'>
                                    Proceed to Checkout
                                </button>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 text-center mb-3">
                                        Secure payment methods
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6z" />
                                        </svg>
                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
                                        </svg>
                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18 6h-2c0-2.76-2.24-5-5-5S6 3.24 6 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 0c0-1.66 1.34-3 3-3s3 1.34 3 3H10z" />
                                        </svg>
                                    </div>
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
