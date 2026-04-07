import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCategories } from '../../features/subcategories/subCategoriesSlice';

const PRICE_RANGES = [
  { label: "₹0 - ₹500", value: "0-500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", value: "500-1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", value: "1000-2000", min: 1000, max: 2000 },
  { label: "₹2000 +", value: "2000+", min: 2000, max: null },
]

const FilterSidebar = ({ category,
  selectedCategories,
  setSelectedCategories,
  selectedPrice,
  setSelectedPrice,
  selectedBrands,
  setSelectedBrands,
  selectedSizes,
  setSelectedSizes,
  isMobile = false
}) => {
  const dispatch = useDispatch();

  const { subCategories, loading } = useSelector(state => state.subCategory);
  const { availableBrands } = useSelector(state => state.products);
  const { availableSizes } = useSelector(state => state.products);

  useEffect(() => {
    if (category) {
      dispatch(fetchSubCategories(category));
    }
  }, [category, dispatch]);

  // ========== Category ==========
  const handleCategoryChange = (slug) => {
    const updated = selectedCategories.includes(slug)
      ? selectedCategories.filter(item => item !== slug)
      : [...selectedCategories, slug];

    setSelectedCategories(updated);
  }

  // ========== Price ==========
  const handlePriceChange = (value) => {
    setSelectedPrice(prev => prev === value ? null : value)
  }

  // ========== Brands ==========
  const handleBrandsChange = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(item => item !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
  }

  // ========== Sizes ==========
  const handleSizesChange = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter(item => item !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
  }

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPrice(null);
    setSelectedBrands([]);
    setSelectedSizes([]);
  }
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 h-fit">
      {!isMobile && (
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Filters
          </h2>
          <button onClick={clearAllFilters} className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
            Clear All
          </button>
        </div>
      )}

      {isMobile && (
        <div className="flex justify-end mb-4">
          <button onClick={clearAllFilters} className='text-sm text-blue-600 font-medium'>
            Clear All
          </button>
        </div>
      )}

      {/* Header with Clear All button */}
      {/* <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          Filters
        </h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Clear All
        </button>
      </div> */}

      {/* 1. Category / SubCategory */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          Category
        </h3>
        <div className="space-y-2">
          {loading ? (
            <p>loading</p>
          ) : (
            subCategories.map((subCategory) => (
              <label key={subCategory._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(subCategory.slug)}
                  onChange={() => handleCategoryChange(subCategory.slug)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{subCategory.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* 2. Category / SubCategory */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          Price Range
        </h3>
        <div className="space-y-2">
          {loading ? (
            <p>loading</p>
          ) : (
            PRICE_RANGES.map((range) => (
              <label key={range.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  checked={selectedPrice === range.value}
                  onChange={() => handlePriceChange(range.value)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{range.label}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* 3. Brands */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          Brands
        </h3>
        <div className="space-y-2">
          {!availableBrands || availableBrands.length === 0 ? (
            <p>No brands availabel</p>
          ) : (
            availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandsChange(brand)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* 4. Sizes */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          Select Sizes
        </h3>
        <div className="flex flex-wrap gap-2">
          {!availableSizes || availableSizes.length === 0 ? (
            <p>No sizes availabel</p>
          ) : (
            availableSizes.map((size) => (
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded">
                <button
                  key={size}
                  type='button'
                  onClick={() => handleSizesChange(size)}
                  className={`min-w-10.5 h-9 px-3 rounded-md text-sm font-medium transition-all ${selectedSizes.includes(size)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {size}
                </button>
              </label>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default FilterSidebar;