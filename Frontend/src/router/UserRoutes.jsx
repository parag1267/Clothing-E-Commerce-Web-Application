import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLayout from '../layout/UserLayout'
import Home from '../containers/user/Home'
import Blog from '../containers/user/Blog'
import Contact from '../containers/user/Contact'
import Men from '../containers/user/Men'
import Women from '../containers/user/Women'
import ProductDetails from '../components/user/ProductDetails'
import Cart from '../containers/user/Cart'
import WishList from '../containers/user/WishList'
import Profile from '../containers/user/Profile'
import ProductListing from '../containers/user/ProductListing'

const UserRouters = () => {
  return (
    <>
      <Routes>
        <Route element={<UserLayout/>}>
          <Route index element={<Home />}/>
          <Route path='/men' element={<Men />}/>
          <Route path='/women' element={<Women />}/>
          <Route path='/product-list' element={<ProductListing />}/>
          <Route path='/product/:id' element={<ProductDetails />}/>
          <Route path='/blog' element={<Blog />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/wishlist' element={<WishList />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>
      </Routes> 
    </>
  )
}

export default UserRouters
