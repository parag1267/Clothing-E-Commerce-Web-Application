import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { googleUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(googleUser())
            .unwrap()
            .then((user) => {
                toast.success("Login with Google successfully");
                if (user.role === "admin") {
                    navigate("/admin")
                }
                else {
                    navigate("/")
                }
            })
            .catch(() => {
                toast.error("Google login failed");
                navigate("/login")
            })
    })
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='text-center'>
                <div className='w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-gray-600 text-sm font-medium'>Signing you in with Google...</p>
            </div>
        </div>
    )
}

export default GoogleCallback
