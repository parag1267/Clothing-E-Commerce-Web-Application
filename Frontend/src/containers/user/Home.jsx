import React from 'react'
import NewArrivalsHome from '../../components/user/NewArrivalsHome'
import Newsletter from '../../components/user/Newsletter'
import ShopByCategory from '../../components/user/ShopByCategory'
import TrendingProduct from '../../components/user/TrendingProduct'
import BestSellers from '../../components/user/BestSellers'
import HomeSlider from '../../components/user/HomeSlider'



const Home = () => {
  return (
    <>
        <HomeSlider />

        <ShopByCategory />

        <NewArrivalsHome />

        {/* <BestSellers />  */}

        <TrendingProduct />

        <Newsletter />
    </>
  )
}

export default Home
