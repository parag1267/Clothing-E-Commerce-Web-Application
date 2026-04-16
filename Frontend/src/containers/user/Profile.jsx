import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logout, fetchUserProfile } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { Camera, Mail, Phone, Calendar, User, LogOut, Save, X, ShoppingBag, Package } from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { resetWishlist } from '../../features/wishlist/wishlistSlice'
import { clearCart } from '../../features/cart/cartSlice'

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const [isEdit, setEdit] = useState(false);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        dispatch(fetchUserProfile())
    }, [dispatch])

    useEffect(() => {
        if (user?.profileImage?.url) {
            setPreview(user.profileImage.url)
        }
    }, [user])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullname: user?.fullname || "",
            mobileNo: user?.mobileNo || "",
            profileImage: null
        },

        validationSchema: Yup.object({
            fullname: Yup.string().required("Fullname required"),
            mobileNo: Yup.string().matches(/^[6-9]\d{9}$/, "Invalid mobile")
        }),

        onSubmit: async (values) => {
            const data = new FormData();
            data.append("fullname", values.fullname);
            data.append("mobileNo", values.mobileNo);
            if (values.profileImage) {
                data.append("profileImage", values.profileImage);
            }

            await axios.put(
                "http://localhost:5000/api/auth/profile",
                data,
                { withCredentials: true }
            )

            dispatch(fetchUserProfile())
            setEdit(false);
        }
    })

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            formik.setFieldValue("profileImage", file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        dispatch(resetWishlist())
        dispatch(clearCart())
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center md:px-4 py-5 md:py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="bg-linear-to-r from-blue-500 to-blue-600 h-24 relative">
                    <div className="absolute top-4 left-5 flex items-center gap-1.5 opacity-30">
                        <ShoppingBag size={16} className="text-white" />
                        <span className="text-white text-sm font-bold">ClothKart</span>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="md:px-6 pb-7 relative">
                    {/* HEADER */}
                    <div className="flex flex-col items-center -mt-14">
                        {/* Avatar */}
                        <div className="relative">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center rounded-full text-3xl font-bold border-4 border-white shadow-lg">
                                    {user?.fullname?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Upload Icon */}
                            {isEdit && (
                                <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Camera size={16} className="text-red-500" />
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImage}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Name */}
                        {isEdit ? (
                            <div className="w-full mt-3">
                                <input
                                    name="fullname"
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                    className="text-center text-lg font-semibold border-2 border-gray-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Full name"
                                />
                                {formik.touched.fullname && formik.errors.fullname && (
                                    <p className="text-xs text-red-500 text-center mt-1">{formik.errors.fullname}</p>
                                )}
                            </div>
                        ) : (
                            <h2 className="mt-3 text-xl font-bold text-gray-800">{user?.fullname}</h2>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="mt-6 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                        {/* Email */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Mail size={15} className="text-blue-500" />
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Email</span>
                            </div>
                            <span className="text-sm text-gray-800 font-semibold truncate max-w-[180px]">
                                {user?.email}
                            </span>
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Phone size={15} className="text-blue-500" />
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Mobile</span>
                            </div>
                            {isEdit ? (
                                <div className="text-right">
                                    <input
                                        name="mobileNo"
                                        value={formik.values.mobileNo}
                                        onChange={formik.handleChange}
                                        className="border border-gray-200 rounded px-2 py-1 w-32 text-right focus:outline-none focus:border-teal-500"
                                        placeholder="Mobile number"
                                        maxLength={10}
                                    />
                                    {formik.touched.mobileNo && formik.errors.mobileNo && (
                                        <p className="text-xs text-red-500 mt-0.5">{formik.errors.mobileNo}</p>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-800 font-medium">{user?.mobileNo}</span>
                            )}
                        </div>

                        {/* Joined */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Calendar size={15} className="text-blue-500" />
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Joined</span>
                            </div>
                            <span className="text-gray-800 font-semibold">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                    : '-'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/track-order')}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                            <Package size={16} />
                            My Orders
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/wishlist')}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                            <ShoppingBag size={16} />
                            Wishlist
                        </button>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-4 space-y-3">

                        {isEdit ? (
                            <>
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors shadow-sm disabled:opacity-602"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEdit(false)
                                        formik.resetForm()
                                        setPreview(user?.profileImage?.url || "")
                                    }}
                                    className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setEdit(true)}
                                className="w-full border-2 border-blue-500 text-blue-500 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-blue-50 transition-colors"
                            >
                                <User size={18} />
                                Edit Profile
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile