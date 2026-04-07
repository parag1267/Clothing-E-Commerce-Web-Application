import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import InputField from '../common/InputField'
import SelectField from '../common/SelectField'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const AddUserModel = ({isOpen,onClose,onSave}) => {
  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string().matches(/^\S+@\S+\.\S+$/, "Invalid email").email("Invalid email").required("Email address is required"),
    password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Must include upper, lower,number & special char").min(8, "Minimum 8 Charcters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
    mobileNo: Yup.string().matches(/^[6-9]\d{9}$/, "Invalid mobile number").required("Mobile number is required"),
    role: Yup.string().oneOf(["user", "admin"]).required("Role is required")
  })

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNo: '',
      role: ''
    },

    validationSchema,

    onSubmit: async (values,{resetForm}) => {
      await onSave(values);
      resetForm();
      onClose();
    }
  })

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add new user
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>

            <InputField
              type='text'
              name="fullname"
              placeholder='Enter category name'
              value={formik.values.fullname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.fullname}
              touched={formik.touched.fullname}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>

            <InputField
              type='email'
              name="email"
              placeholder='Enter email address'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>

            <InputField
              type='password'
              name="password"
              placeholder='Enter password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>

            <InputField
              type='password'
              name="confirmPassword"
              placeholder='Enter confirm password '
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No *
            </label>

            <InputField
              type='text'
              name="mobileNo"
              placeholder='Enter Mobile No'
              value={formik.values.mobileNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.mobileNo}
              touched={formik.touched.mobileNo}
            />
          </div>

          <SelectField
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={[
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" }
            ]}
            error={formik.errors.role}
            touched={formik.touched.role}
          >
          </SelectField>

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
              Create User
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddUserModel
