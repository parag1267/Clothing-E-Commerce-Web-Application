import { useFormik } from 'formik';
import { Mail, MapPin, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import InputField from '../../components/common/InputField'
import TextAreaField from '../../components/common/TextAreaField'
import { useDispatch, useSelector } from 'react-redux';
import { resetContactState, sendContactMessage } from '../../features/contact/contactSlice';
import { toast } from 'react-toastify';

const contactValidationSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').required('Name is required'),
  email: Yup.string().email('Please enter a valid email address (example@gmail.com)').required('Email is required'),
  phone: Yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number').required('Phone number is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').max(500, 'Message cannot exceed 500 characters').required('Message is required')
})

const Contact = () => {
  const dispatch = useDispatch();

  const {loading,success,error} = useSelector((state) => state.contact)

  useEffect(() => {
    return () => {
      dispatch(resetContactState())
    }
  },[dispatch])

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },

    validationSchema: contactValidationSchema,
    onSubmit: async (values,{resetForm}) => {
      const resultAction = await dispatch(sendContactMessage(values))
      if (sendContactMessage.fulfilled.match(resultAction)) {
        resetForm()
      }
      toast.success("Submitting message successfully done")
    }
  })
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className="bg-white text-black py-16 px-6 text-center">
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900'>Contact Us</h1>
        <p className='mt-3 text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed'>
          Have questions about our Clothing, orders, or returns?
          Our team is here to help you anytime.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
          <div className="h-0.75 w-8 bg-blue-500 rounded-full" />
          <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={22} className="text-blue-500" />
          </div>
          <h3 className='font-extrabold tracking-tight text-gray-900 mb-2'>Address</h3>
          <p className='text-gray-400 text-sm leading-relaxed'>
            Creative LifeStyle<br />
            Shop No. 11, Fashion Plzza,<br />
            AK Road, Andheri East,<br />
            Vesu, Surat - 395010
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone size={22} className="text-blue-500" />
          </div>
          <h3 className='font-extrabold tracking-tight text-gray-900 mb-2'>Phone</h3>
          <p className='text-gray-400 text-sm leading-relaxed'>
            +91 6356143218<br />
            +91 9737712612
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={22} className="text-blue-500" />
          </div>
          <h3 className='font-extrabold tracking-tight text-gray-900 mb-2'>✉ Email</h3>
          <p className='text-gray-400 text-sm leading-relaxed'>
            creativelifestyle@gmail.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-10">
        <div className="bg-white shadow rounded-xl p-8">
          <h2 className='text-2xl font-semibold mb-6'>
            Send us a message
          </h2>

          <form className='space-y-5' onSubmit={formik.handleSubmit}>
            <InputField
              name="name"
              type="text"
              placeholder='Your Name *'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.touched.name} />

            <InputField
              name="email"
              type="email"
              placeholder='Your Email *'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email} />

            <InputField
              name="phone"
              type="tel"
              placeholder='Phone Number'
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.phone}
              touched={formik.touched.phone} />

            <div>
              <TextAreaField
                name="message"
                placeholder='Your Message *'
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.message}
                touched={formik.touched.message}
              />
              <p className="text-xs text-gray-400 -mt-3 text-right">
                {formik.values.message.length}/500
              </p>
            </div>

            <button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]'>
              Send Message
            </button>
          </form>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm">
          <iframe
            title='map'
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14880.237854371087!2d72.85362279840352!3d21.189796637998903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fb09f6e05d5%3A0x7f1297a24491d240!2sParvat%20Patiya%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1771043201161!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            className='w-full h-full min-h-[400px] border-0'></iframe>
        </div>
      </div>
    </div>
  )
}

export default Contact
