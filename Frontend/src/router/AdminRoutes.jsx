import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import Dashboard from '../containers/admin/Dashboard'
import Customer from '../containers/admin/Customer'
import AddEditProduct from '../containers/admin/AddEditProduct'
import ProductsList from '../containers/admin/ProductsList'
import Categories from '../containers/admin/Categories'
import SubCategories from '../containers/admin/SubCategories'
import Order from '../containers/admin/Order'
import Profile from '../containers/admin/Profile'
import Settings from '../containers/admin/Settings'
import ContactInfo from '../containers/admin/ContactInfo'

const AdminRouters = () => {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />}/>
          <Route path='customers' element={<Customer />}/>
          <Route path='categories' element={<Categories />}/>
          <Route path='subcategories' element={<SubCategories />}/>
          <Route path='addproduct' element={<AddEditProduct />}/>
          <Route path='products/edit/:id' element={<AddEditProduct />}/>
          <Route path='productlist' element={<ProductsList />}/>
          <Route path='orders' element={<Order/>}/>
          <Route path='profile' element={<Profile />}/>
          <Route path='settings' element={<Settings />}/>
          <Route path='contactInfo' element={<ContactInfo />}/>
        </Route>
      </Routes>
    </>
  )
}

export default AdminRouters
