import React from 'react'
import InputField from '../components/common/InputField'
import PasswordField from '../components/common/PasswordField'
import PhoneField from '../components/common/PhoneField'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {loading} = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    fullname: Yup.string().min(4).required("Fullname is an required"),
    email: Yup.string().email().required("Email is an required"),
    password: Yup.string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be strong Character"
    ).required("Password is an required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")],"Password must match").required("Confirm password is required"),
    mobileNo: Yup.string().matches(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number").required("Phone is required"),
  })

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNo: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await dispatch(registerUser(values)).unwrap();

        toast.success(res.message);
        resetForm();
        navigate("/login");
      } catch (error) {
        if(typeof error === "string"){
          toast.error(error);
        }
        else{
          toast.error(error?.message || "Registeration failed");
        }
      }
    }
  });

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-3 sm:p-6 rounded-xl shadow">
        <form onSubmit={formik.handleSubmit}>
          <InputField
            label="Full Name *"
            placeholder="Full Name"
            name='fullname'
            value={formik.values.fullname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.fullname}
            touched={formik.touched.fullname}
          />

          <InputField
            label="Email ID *"
            placeholder="Email"
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />

          <PhoneField
            label="Mobile Number *"
            placeholder="Mobile Number"
            name='mobileNo'
            value={formik.values.mobileNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.mobileNo}
            touched={formik.touched.mobileNo}
          />

          <PasswordField
            label="Choose New Password *"
            placeholder="Choose New Password"
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          <PasswordField
            label="Confirm Password *"
            placeholder="Confirm Password"
            name='confirmPassword'
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
          />

          <button className='btn-primary' type='submit' disabled={loading}>
            {loading ? "Registering.." : "Register"}
          </button>

          <div className="m-2 text-center">
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <Link to='/login' className="text-teal-600 font-medium hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
