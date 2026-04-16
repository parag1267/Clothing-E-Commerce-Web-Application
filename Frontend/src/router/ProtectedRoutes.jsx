import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const dispatch = useDispatch();
    const { user, appLoading } = useSelector(state => state.auth)

    if (appLoading) {
        return <div className="text-center mt-10">Loading...</div>
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }

    if(user?.role !== "admin"){
        return <Navigate to="/" replace/>
    } 

    return <Outlet />
}

export default ProtectedRoutes
