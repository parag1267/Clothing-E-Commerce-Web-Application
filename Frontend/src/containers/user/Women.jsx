import React from 'react'
import Categories from '../../components/user/Categories'
import ProductList from '../../components/user/ProductList'
import WomenSlider from '../../components/user/WomenSlider'
const Women = () => {
  return (
    <>
      <WomenSlider />

      <Categories categorySlug="women" /> 

      <ProductList category="women"/>
    </>
  )
}

export default Women
