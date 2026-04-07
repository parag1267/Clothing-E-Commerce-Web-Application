import React, { useEffect, useState } from 'react'
import InputField from '../../components/common/InputField'
import TextAreaField from '../../components/common/TextAreaField'
import SelectField from '../../components/common/SelectField'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, fetchSingleProduct, resetCreateState, updateProduct, clearProduct, resetUpdateState } from '../../features/products/productSlice'
import { toast } from 'react-toastify'
import { fetchCategories } from '../../features/categories/categoriesSlice'
import { fetchSubCategories } from '../../features/subcategories/subCategoriesSlice'
import { useNavigate, useParams } from 'react-router-dom'

const AddEditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { createSuccess, updateSuccess, loading, product: editProduct } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.category);
  const { subCategories } = useSelector(state => state.subCategory);

  const [images, setImages] = useState([]);
  

  // Load Categories
  useEffect(() => {
    dispatch(fetchCategories());
    if (!isEditMode) {
      dispatch(clearProduct())
    }
  }, [dispatch, isEditMode]);

  // Load Product
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchSingleProduct(id));
    }
  }, [id, dispatch, isEditMode]);

  
  // Covert size array to string for edit mode
  const formatSizes = (sizes) => {
    if (!sizes) return ""
    return sizes.map(s => `${s.size}:${s.stock}`).join(", ")
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editProduct?.name || "",
      description: editProduct?.description || "",
      price: editProduct?.price || "",
      discountPercentage: editProduct?.discountPercentage || "",
      brand: editProduct?.brand || "",
      category: editProduct?.category?.slug || "",
      subCategory: editProduct?.subCategory?.slug || "",
      fabric: editProduct?.fabric || "",
      fitType: editProduct?.fitType || "",
      tags: editProduct?.tags?.join(", ") || "",
      sizes: formatSizes(editProduct?.sizes),
      images: isEditMode ? (editProduct?.images || []) : [],

      manufacturer: {
        name: editProduct?.manufacturer?.name || "",
        contactPhone: editProduct?.manufacturer?.contactPhone || "",
        email: editProduct?.manufacturer?.email || "",
        address: {
          city: editProduct?.manufacturer?.address?.city || "",
          state: editProduct?.manufacturer?.address?.state || "",
          pincode: editProduct?.manufacturer?.address?.pincode || ""
        }
      },
      isNewArrival: editProduct?.isNewArrival || false,
      isTrending: editProduct?.isTrending || false,
      isActive: editProduct?.isActive ?? true
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.string().required("Price is required"),
      discountPercentage: Yup.string().required("Discount price is required"),
      brand: Yup.string().required("Brand is required"),
      category: Yup.string().required("Category is required"),
      subCategory: Yup.string().required("Sub Category is required"),
      fabric: Yup.string().required("Fabric is required"),
      fitType: Yup.string().required("Fit Type is required"),
      tags: Yup.string().required("Tags required"),
      sizes: Yup.string().required("Sizes required"),
      images: isEditMode ? Yup.array() : Yup.array().min(1, "At least one image is required").required("Product image is required"),

      manufacturer: Yup.object({
        name: Yup.string().required("Manufacturer name required"),
        contactPhone: Yup.number().required(" contact number required"),
        email: Yup.string().required("Email is Required"),
        address: Yup.object({
          city: Yup.string().required("City required"),
          state: Yup.string().required("State required"),
          pincode: Yup.string().matches(/^\d{6}$/, "Invalid pincode").required("PinCode required")
        })
      })
    }),

    onSubmit: (values) => {
      const formData = new FormData();

      const sizesArray = values.sizes
        ? values.sizes.split(",").map(item => {
          const [size, stock] = item.split(":");
          return {
            size: size.trim().toUpperCase(),
            stock: Number(stock?.trim() || 0)
          }
        })
        : []

      Object.keys(values).forEach((key) => {
        if (key === "tags") {
          formData.append("tags", JSON.stringify(values.tags.split(",").map(t => t.trim()).filter(Boolean)));
        }
        else if (key === "manufacturer") {
          formData.append("manufacturer", JSON.stringify(values.manufacturer));
        }
        else if (key === "sizes") {
          formData.append("sizes", JSON.stringify(sizesArray))
        }

        else if (key === "isNewArrival" || key === "isTrending" || key === "isActive") {
          formData.append(key, String(values[key]));
        }
        else if (key !== "images") {
          formData.append(key, values[key]);
        }
      });

      const removePublicIds = (editProduct?.images || [])
        .filter((serverImg) =>
          !images.some(
            (localImg) => localImg.existing && localImg.public_id === serverImg.public_id
          )
        )
        .map((img) => img.public_id)

      if (removePublicIds.length > 0) {
        formData.append('removeImages', JSON.stringify(removePublicIds))
      }

      images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      if (isEditMode) {
        dispatch(updateProduct({ id, data: formData }))
      }
      else {
        dispatch(createProduct(formData))

      }
    }
  });

  // Set Images
  useEffect(() => {
    if (isEditMode && editProduct?.images?.length > 0) {
      const existingImages = editProduct.images.map((img) => ({
        url: img.url,
        public_id: img.public_id,
        file: null,
        existing: true
      }))

      setImages(existingImages);
      formik.setFieldValue('images', existingImages)
    }
  }, [editProduct])

  
  // 🔥 Fetch subcategories when category exists
  useEffect(() => {
    if (formik.values.category) {
      dispatch(fetchSubCategories(formik.values.category))
    }
  }, [formik.values.category, dispatch])


  // Image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      existing: false
    }));

    const updatedImages = [...images, ...preview];
    setImages(updatedImages);
    formik.setFieldValue('images', updatedImages);
  }

  useEffect(() => {
    if (createSuccess) {
      toast.success("Product created successfully");
      formik.resetForm();
      setImages([]);
      dispatch(resetCreateState())
    }
  }, [createSuccess])

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Product updated successfully");
      dispatch(resetUpdateState());
      navigate('/admin/productlist')
    }
  }, [updateSuccess])

  const categoryOptions = (categories).map(category => ({
    label: category.name,
    value: category.slug
  }))

  const subCategoryOptions = (subCategories).map(subCategory => ({
    label: subCategory.name,
    value: subCategory.slug
  }))


  return (
    <div className='min-h-full'>
      <div className="mb-6">
        <h1 className='text-2xl font-bold text-gray-900'>Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new product to your store</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-5">
              <InputField
                name="name"
                label="Product Name"
                placeholder="Enter product name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.touched.name}
              />

              <TextAreaField
                name="description"
                label="Product Details"
                placeholder="Enter description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.description}
                touched={formik.touched.description}
              />
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priceing</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputField
                name="brand"
                label="Brand"
                placeholder="Enter brand name"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.brand}
                touched={formik.touched.brand}
              />

              <InputField
                name="price"
                label="Price"
                placeholder="Enter price "
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.price}
                touched={formik.touched.price}
              />

              <InputField
                name="discountPercentage"
                label="Discount Percentage"
                placeholder="Enter discount price (%)"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.discountPercentage}
                touched={formik.touched.discountPercentage}
              />

              <InputField
                name="sizes"
                label="Sizes (e.g. S:10, M:5)"
                placeholder="Enter sizes with stock"
                value={formik.values.sizes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.sizes}
                touched={formik.touched.sizes}
              />

            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category & Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="category"
                label="Category"
                placeholder="Select Category"
                value={formik.values.category}
                onChange={(e) => {
                  formik.handleChange(e)
                  formik.setFieldValue("subCategory","")
                }}
                onBlur={formik.handleBlur}
                error={formik.errors.category}
                touched={formik.touched.category}
                options={categoryOptions}
              />

              <SelectField
                name="subCategory"
                label="Sub Category"
                placeholder="Select Sub Category"
                value={formik.values.subCategory || ""}
                disabled={!formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.subCategory}
                touched={formik.touched.subCategory}
                options={subCategoryOptions}
              />

              <InputField
                name="fabric"
                label="Fabric"
                placeholder="Enter product fabric"
                value={formik.values.fabric}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.fabric}
                touched={formik.touched.fabric}
              />

              <InputField
                name="fitType"
                label="Fit Type"
                placeholder="Enter product fit type"
                value={formik.values.fitType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.fitType}
                touched={formik.touched.fitType}
              />
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"></h3>
            <InputField
              name="tags"
              label="Tags"
              placeholder="Comma separated tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.tags}
              touched={formik.touched.tags}
            />
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Manufacturer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputField
                name="manufacturer.name"
                label="Manufacturer Name"
                placeholder="Enter manufacturer name"
                value={formik.values.manufacturer.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.manufacturer?.name}
                touched={formik.touched.manufacturer?.name}
              />

              {/* ✅ Fix 2 — contactPhone field add kiya */}
              <InputField
                name="manufacturer.contactPhone"
                label="Contact Phone"
                placeholder="Enter 10 digit phone number"
                value={formik.values.manufacturer.contactPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.manufacturer?.contactPhone}
                touched={formik.touched.manufacturer?.contactPhone}
              />

              {/* ✅ Fix 2 — Email field add kiya */}
              <InputField
                name="manufacturer.email"
                label="Email address"
                placeholder="Enter email address"
                value={formik.values.manufacturer.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.manufacturer?.email}
                touched={formik.touched.manufacturer?.email}
              />

              <InputField
                name="manufacturer.address.city"
                label="City"
                placeholder="Enter city"
                value={formik.values.manufacturer.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.manufacturer?.address?.city}
                touched={formik.touched.manufacturer?.address?.city}
              />

              <InputField
                name="manufacturer.address.state"
                label="State"
                placeholder="Enter state"
                value={formik.values.manufacturer.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.manufacturer?.address?.state}
                touched={formik.touched.manufacturer?.address?.state}
              />

              <InputField
                name="manufacturer.address.pincode"
                label="Pincode"
                placeholder="Enter pincode"
                value={formik.values.manufacturer.address.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.manufacturer?.address?.pincode}
                touched={formik.touched.manufacturer?.address?.pincode}
              />

            </div>
          </div>


          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              {images.length === 0 ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">

                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input type="file" hidden multiple onChange={handleImageChange} />
                </label>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id || index} className="relative group">
                      <img src={image.url} alt={`product ${index + 1}`} className='w-full h-34 object-cover rounded-lg border border-gray-200 shadow-sm' />

                      <button
                        type='button'
                        onClick={() => {
                          const updated = images.filter((_, i) => i !== index);
                          setImages(updated);
                          formik.setFieldValue("images", updated);
                        }}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600'>
                        ✕
                      </button>
                    </div>
                  ))}

                  <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-gray-500 mt-1">Add More</span>
                    </div>
                    <input type="file" hidden multiple onChange={handleImageChange} />
                  </label>
                </div>
              )}

              {formik.errors.images && formik.touched.images && (
                <p className="input-error">
                  {formik.errors.images}
                </p>
              )}

              {images.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {images.length} image's uploaded
                </p>
              )}
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
            <div className="flex flex-wrap gap-6">
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  name='isNewArrival'
                  checked={formik.values.isNewArrival}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">New Arrival Product</span>
              </label>

              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  name='isTrending'
                  checked={formik.values.isTrending}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Trending Product</span>
              </label>

              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  name='isActive'
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active Product</span>
              </label>
            </div>
          </div>

          <div className="p-6 border-gray-50 rounded-b-xl flex gap-3 justify-end">
            <button type='button' className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200' onClick={() => formik.resetForm()}>
              Reset
            </button>
            <button type='submit' className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200' disabled={loading}>
              {loading ? "Creating.." : isEditMode ? "Update product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditProduct
