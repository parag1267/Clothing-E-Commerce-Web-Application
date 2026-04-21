import React from 'react'
import InputField from '../components/common/InputField'
import PasswordField from '../components/common/PasswordField'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import goggleIcon from '../assets/Images/icons/Google.png'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginLoading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be strong Character"
    ).required("Password is an required")
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await dispatch(loginUser(values)).unwrap();
        resetForm();

        if (res.user.role === "admin") {
          navigate("/admin");
          toast.success("Admin login successfully");
        } else {
          navigate("/");
          toast.success("Login successfully");
        }
      } catch (error) {
        toast.error(error)
      }
    }
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-3'>
      <div className='w-full max-w-sm sm:max-w-md bg-white p-3 sm:p-6 rounded-xl shadow'>
        <form onSubmit={formik.handleSubmit}>
          <InputField
            label="Email *"
            placeholder="Email"
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />

          <PasswordField
            label="Password *"
            placeholder="Password"
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          <button className='btn-primary' type='submit' disabled={loginLoading}>
            {loginLoading ? "Logging in.." : "Login"}
          </button>

          <div className="m-2 text-center">
            <p className='text-sm text-gray-600'>
              New user?{" "}
              <Link to='/register' className="text-teal-600 font-medium hover:underline">Create an account</Link>
            </p>
          </div>

          {/* <div className='flex items-center w-full my-4'>
            <div className="flex-1 border-t border-dashed border-gray-400"></div>
            <span className='mx-4 text-gray-600 text-sm font-medium'>OR</span>
            <div className="flex-1 border-t border-dashed border-gray-400"></div>
          </div>

          <div className="flex items-center justify-center p-2 mt-4">
            <button className='flex items-center justify-center gap-3 border-gray-100 rounded-lg p-3 hover:bg-gray-200 bg-gray-100 transition w-full' type='button'>
              <img src={goggleIcon} alt="Goggle" className='w-5 h-5' />
              <span className='text-sm font-medium text-gray-700'>Continue with Google</span>
            </button>
          </div> */}
        </form>
      </div>
    </div>
  )
}

export default Login
