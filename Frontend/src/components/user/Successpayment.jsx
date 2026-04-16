import React, { useEffect, useState } from 'react'   // ✅ FIX 1: useEffect import kiya
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../features/cart/cartSlice';
import { verifyPayment } from '../../features/payment/paymentSlice';

const Successpayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");
        const session_id = params.get("session_id");

        if (!orderId || !session_id) {
            navigate("/cart");
            return;
        }

        const verify = async () => {
            try {
                const result = await dispatch(
                    verifyPayment({ orderId, session_id })
                );

                if (verifyPayment.fulfilled.match(result)) {
                    dispatch(clearCart())
                    setStatus("success");

                    setTimeout(() => {
                        navigate("/");
                    }, 3000);

                } else {
                    setStatus("error");

                    setTimeout(() => {
                        navigate("/cart");
                    }, 3000);
                }

            } catch (err) {
                setStatus("error");
            }
        };

        verify();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full mx-4">

                {/* Verifying State */}
                {status === "verifying" && (
                    <>
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
                        <p className="text-sm text-gray-500">Please wait, do not close this tab.</p>
                    </>
                )}

                {/* Success State */}
                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-sm text-gray-500">
                            Your order has been placed. Redirecting to home...
                        </p>
                    </>
                )}

                {/* Error State */}
                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-sm text-gray-500">
                            Something went wrong. Redirecting to cart...
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

export default Successpayment;