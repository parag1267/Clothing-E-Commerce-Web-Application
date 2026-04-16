import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import InputField from '../../components/common/InputField'
import TextAreaField from '../../components/common/TextAreaField'
import { createOrder, fetchSavedAddresses } from '../../features/order/orderSlice'
import { createPaymentSession } from '../../features/payment/paymentSlice'

const addressSchema = Yup.object({
  fullname: Yup.string().min(3, "Minimum 3 Charcters required").required("Fullname is required"),

  phone: Yup.string().matches(/^\d{10}$/, 'Enter valid 10-digit phone number').required('Phone number is required'),

  address: Yup.string()
    .min(5, 'Please enter a valid address')
    .required('Address is required'),

  city: Yup.string()
    .required('City is required'),

  state: Yup.string()
    .required('State is required'),

  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Enter valid 6-digit pincode')
    .required('Pincode is required'),
})

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { cart } = useSelector(state => state.cart)
  const { loading: orderLoading, error: orderError, savedAddresses = [] } = useSelector(state => state.order);
  const { loading: paymentLoading, error: paymentError } = useSelector(state => state.payment);

  const loading = orderLoading || paymentLoading;
  const error = orderError || paymentError;

  const totalPrice = cart?.items?.reduce((acc, item) => {
    if (!item.product) return acc
    return acc + item.product.price * item.quantity
  }, 0) || 0

  useEffect(() => {
    dispatch(fetchSavedAddresses())
  }, [dispatch])

  useEffect(() => {
    if (savedAddresses.length === 0) {
      setShowForm(true)
    } else {
      setSelectedAddressId(savedAddresses[0]._id)
      setShowForm(false)
    }
  }, [savedAddresses])

  const formik = useFormik({
    initialValues: {
      fullname: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
    validationSchema: addressSchema,
    onSubmit: async (values) => {
      await handlePlaceOrder(values)
    }
  })

  const canProceed = showForm
    ? (formik.isValid && formik.dirty)
    : !!selectedAddressId

  const handlePlaceOrder = async (addressValues) => {
    if (!cart?.items?.length) return
    const selectedAddress = (!showForm && selectedAddressId)
      ? savedAddresses.find(a => a._id === selectedAddressId)
      : addressValues

    if (!selectedAddress) return

    const orderData = {
      items: cart.items.map(item => ({
        product: item.product._id,
        size: item.size,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullname: selectedAddress.fullname,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      }
    };

    const orderResult = await dispatch(createOrder(orderData))
    if (createOrder.fulfilled.match(orderResult)) {
      const orderId = orderResult.payload?.order?._id;
      if (orderId) {
        const paymentResult = await dispatch(createPaymentSession(orderId))
        if (createPaymentSession.fulfilled.match(paymentResult)) {
          const sessionUrl = paymentResult.payload?.url
          if (sessionUrl) {
            window.location.href = sessionUrl
          } else {
            navigate(`/payment/${orderId}`)
          }
        }
      }
    }
  }

  const handleContinue = () => {
    if (showForm) {
      formik.handleSubmit()
    } else {
      handlePlaceOrder(null)
    }
  }

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id)
    setShowForm(false)
  }

  const handleToggleForm = () => {
    setShowForm(prev => !prev);
    setSelectedAddressId(null)
  }


  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10'>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                  <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="p-6">
                {savedAddresses.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Saved Addresses</p>
                    <div className="space-y-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => handleSelectAddress(addr._id)}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${selectedAddressId === addr._id && !showForm
                              ? 'border-black bg-gray-50'
                              : 'border-gray-100 hover:border-gray-300 bg-white'
                            }`}>

                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                            ${selectedAddressId === addr._id && !showForm ? 'border-black' : 'border-gray-300'}`}>
                            {selectedAddressId === addr._id && !showForm && (
                              <div className="w-2 h-2 rounded-full bg-black" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900">{addr.fullname}</p>
                              <span className="text-gray-300">·</span>
                              <p className="text-xs text-gray-500">{addr.phone}</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleForm}
                      className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500
                        hover:border-black hover:text-black transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showForm
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        }
                      </svg>
                      {showForm ? 'Cancel — Use saved address' : 'Add New Address'}
                    </button>
                  </div>
                )}

                {showForm && (
                  <form onSubmit={formik.handleSubmit} className='space-y-4'>
                    {savedAddresses.length > 0 && (
                      <p className="text-sm font-semibold text-gray-700">New Address</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        name='fullname'
                        label='Fullname *'
                        placeholder='John Doe'
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.fullname}
                        touched={formik.touched.fullname}
                      />

                      <InputField
                        name='phone'
                        label='Mobile Number *'
                        placeholder='1234567890'
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.phone}
                        touched={formik.touched.phone}
                      />
                    </div>

                    <TextAreaField
                      name="address"
                      label="Address *"
                      placeholder="House No., Building, Street, Area"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors.address}
                      touched={formik.touched.address}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <InputField
                        name='city'
                        label='City *'
                        placeholder='Enter city'
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.city}
                        touched={formik.touched.city}
                      />

                      <InputField
                        name='state'
                        label='State *'
                        placeholder='Enter State'
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.state}
                        touched={formik.touched.state}
                      />

                      <InputField
                        name='pincode'
                        label='PinCode *'
                        placeholder='Enter pinCode'
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.pincode}
                        touched={formik.touched.pincode}
                      />
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Order Summary</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {cart?.items?.length} {cart?.items?.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
                  {cart?.items?.map((item) => (
                    <div
                      key={item.product?._id + item.size}
                      className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-none"
                    >
                      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-gray-100">
                        <img
                          src={item.product?.images?.[0]?.url}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ₹{item.product?.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-gray-900 shrink-0">
                        ₹{item.product?.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Free
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Payable</span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">₹{totalPrice}</p>
                      <p className="text-xs text-gray-400">Incl. all taxes</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs text-red-500 text-center">{error}</p>
                  </div>
                )}

                <div className='mt-4'>
                  <button
                    type='button'
                    onClick={handleContinue}
                    disabled={!canProceed || loading}
                    className='w-full bg-linear-to-r from-black to-gray-800 text-white py-3.5 rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2'>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        Continue with payment
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2">

                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs text-gray-500">100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
