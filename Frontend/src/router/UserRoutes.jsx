import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLayout from '../layout/UserLayout'
import Home from '../containers/user/Home'
import Contact from '../containers/user/Contact'
import Men from '../containers/user/Men'
import Women from '../containers/user/Women'
import ProductDetails from '../components/user/ProductDetails'
import Cart from '../containers/user/Cart'
import WishList from '../containers/user/WishList'
import Profile from '../containers/user/Profile'
import ProductListing from '../containers/user/ProductListing'
import Order from '../containers/user/Order'
import Successpayment from '../components/user/Successpayment'
import TrackOrder from '../containers/user/TrackOrder'
import NewArrivals from '../containers/user/NewArrivals'
import RelatedProduct from '../containers/user/RelatedProduct'

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
          <Route path='/product/newarrival' element={<NewArrivals />}/>
          <Route path='/product/relatedproduct' element={<RelatedProduct />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/checkout/delivery-address' element={<Order />}/>
          <Route path='/success' element={<Successpayment />}/>
          <Route path='/wishlist' element={<WishList />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/track-order' element={<TrackOrder />}/>
        </Route>
      </Routes> 
    </>
  )
}

export default UserRouters
