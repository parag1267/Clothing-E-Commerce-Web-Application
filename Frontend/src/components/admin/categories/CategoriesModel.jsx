import React, { useEffect, useState } from 'react'
import { ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion'
import InputField from '../../common/InputField'
import TextAreaField from '../../common/TextAreaField'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CategoriesModel = ({ isOpen, onClose, onSave, editingCategory }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: editingCategory?.name || '',
            description: editingCategory?.description || '',
            images: null,
            isActive: editingCategory?.isActive ?? true
        },

        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            description: Yup.string().required("Required")
        }),

        onSubmit: async (values,{resetForm}) => {
            await onSave(values)
            resetForm()
            onClose()
        }
    })

    useEffect(() => {
        if (editingCategory) {
            setImagePreview(editingCategory.images?.url)
        } else {
            setImagePreview(null)
        }
    }, [editingCategory])

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            formik.setFieldValue('images', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        formik.setFieldValue("images",null)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h2>

                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className='p-6 space-y-4'>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>

                        <InputField
                            type='text'
                            name="name"
                            placeholder='Enter category name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.name}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Description *
                        </label>

                        <TextAreaField
                            name="description"
                            rows={4}
                            placeholder='Enter category description'
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.description}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Image
                        </label>

                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                                        <button
                                            type='button'
                                            onClick={removeImage}
                                            className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600' >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className='mx-auto h-12 w-12 text-gray-400' />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    className='sr-only'
                                                    onChange={handleImage}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {formik.touched.images && formik.errors.images && (
                            <p className="mt-1 text-xs text-red-600">{formik.errors.images}</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name='isActive'
                                checked={formik.values.isActive}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                            />
                            <span className="text-sm text-gray-700">Active</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
                        >
                            Cancle
                        </button>
                        <button
                            type='submit'
                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
                        >
                            {editingCategory ? 'Update' : 'Create'} Category
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default CategoriesModel
