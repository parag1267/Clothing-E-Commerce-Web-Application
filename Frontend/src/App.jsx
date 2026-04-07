import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRoutes from './router/AdminRoutes'
import PublicRoutes from './router/PublicRoutes'
import UserRoutes from './router/UserRoutes'
import Register from './containers/Register'
import Login from './containers/Login'
import ProtectedRoutes from './router/ProtectedRoutes'

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path={'/login'} element={<Login />}/>
          <Route path={'/register'} element={<Register />}/>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path={'/admin/*'} element={<AdminRoutes />}/>
        </Route>

        <Route path={'/*'} element={<UserRoutes />}/>
      </Routes>      
    </>
  )
}

export default App
