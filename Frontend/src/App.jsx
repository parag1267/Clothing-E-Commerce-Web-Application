import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRoutes from './router/AdminRoutes'
import PublicRoutes from './router/PublicRoutes'
import UserRoutes from './router/UserRoutes'
import Register from './containers/Register'
import Login from './containers/Login'
import ProtectedRoutes from './router/ProtectedRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from './features/auth/authSlice'

const App = () => {
  const dispatch = useDispatch();
  const { appLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserProfile()); 
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<Register />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path={'/admin/*'} element={<AdminRoutes />} />
        </Route>

        <Route path={'/*'} element={<UserRoutes />} />
      </Routes>
    </>
  )
}

export default App
