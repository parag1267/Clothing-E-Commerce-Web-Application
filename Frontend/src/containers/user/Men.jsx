import React from 'react'
import Categories from '../../components/user/Categories'
import TrendingPolo from '../../components/user/TrendingPolo'
import ProductList from '../../components/user/ProductList'
import MenSlider from '../../components/user/MenSlider'
const Men = () => {
  return (
    <>
        <MenSlider />

        <Categories categorySlug="men" />

        <TrendingPolo />

        <ProductList category="men" />
    </>
  )
}

export default Men
