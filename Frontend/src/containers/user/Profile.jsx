import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logout, fetchUserProfile } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { Camera, Mail, Phone, Calendar, User, LogOut, Save, X } from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

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
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex justify-center items-center px-2">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Header with gradient */}
                <div className="bg-linear-to-r from-red-500 to-red-600 h-24"></div>

                <form onSubmit={formik.handleSubmit} className="px-6 pb-6 relative">
                    {/* HEADER */}
                    <div className="flex flex-col items-center -mt-12">
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
                                <div className="w-24 h-24 bg-linear-to-br from-red-500 to-red-600 text-white flex items-center justify-center rounded-full text-3xl font-bold border-4 border-white shadow-lg">
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
                            <input
                                name="fullname"
                                value={formik.values.fullname}
                                onChange={formik.handleChange}
                                className="mt-3 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="Full name"
                            />
                        ) : (
                            <h2 className="mt-3 text-xl font-bold text-gray-800">{user?.fullname}</h2>
                        )}

                        {/* Role */}
                        <span className="mt-1 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                            {user?.role}
                        </span>
                    </div>

                    {/* INFO */}
                    <div className="mt-6 space-y-4">
                        {/* Email */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <Mail size={18} className="text-gray-400" />
                                <span className="text-gray-600">Email</span>
                            </div>
                            <span className="text-gray-800 font-medium">{user?.email}</span>
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <Phone size={18} className="text-gray-400" />
                                <span className="text-gray-600">Mobile</span>
                            </div>
                            {isEdit ? (
                                <input
                                    name="mobileNo"
                                    value={formik.values.mobileNo}
                                    onChange={formik.handleChange}
                                    className="border border-gray-200 rounded px-2 py-1 w-32 text-right focus:outline-none focus:border-teal-500"
                                    placeholder="Mobile number"
                                />
                            ) : (
                                <span className="text-gray-800 font-medium">{user?.mobileNo}</span>
                            )}
                        </div>

                        {/* Joined */}
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <Calendar size={18} className="text-gray-400" />
                                <span className="text-gray-600">Joined</span>
                            </div>
                            <span className="text-gray-800 font-medium">
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

                    {/* BUTTONS */}
                    <div className="mt-6 space-y-3">

                        {isEdit ? (
                            <>
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
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
                                    className="w-full border py-2 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setEdit(true)}
                                className="w-full border-2 border-red-500 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <User size={18} />
                                Edit Profile
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
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