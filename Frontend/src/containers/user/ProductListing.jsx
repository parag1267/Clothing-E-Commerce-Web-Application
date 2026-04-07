import React, { useEffect, useState } from 'react'
import FilterSidebar from '../../components/user/FilterSidebar'
import ProductItem from '../../components/user/ProductItem'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" }
]

const ProductListing = () => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const sub = searchParams.get("sub");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest")

  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showSortDrawer, setShowSortDrawer] = useState(false)

  useEffect(() => {
    if (sub) {
      setSelectedCategories(sub.split(","));
    }
  }, [sub]);

  useEffect(() => {
    if (showFilterDrawer || showSortDrawer) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [showFilterDrawer, showSortDrawer])

  const activeFilterCount = selectedCategories.length +
    selectedBrands.length +
    selectedSizes.length +
    (selectedPrice ? 1 : 0)

  return (
    <div className='flex flex-col lg:flex-row gap-2 relative'>
      {/* ===== Desktop Sidebar ===== */}
      <div className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <FilterSidebar
          category={category}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
        />
      </div>

      {/* ===== Product Grid ===== */}
      <div className="flex-1 min-w-0 pb-16 lg:pb-0 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <p className="text-sm text-gray-400 hidden lg:block">
            {SORT_OPTIONS.find(o => o.value === selectedSort)?.label}
          </p>

          <select 
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className='hidden lg:block text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ml-auto'
          >
            <option value="" disabled>Select sorting options</option>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowSortDrawer(true)}
            className="lg:hidden flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 bg-white ml-auto"
          >
            {SORT_OPTIONS.find(o => o.value === selectedSort)?.label || "Sort"}
          </button>
        </div>
        <ProductItem
          category={category}
          selectedCategories={selectedCategories}
          selectedPrice={selectedPrice}
          selectedBrands={selectedBrands}
          selectedSizes={selectedSizes}
          selectedSort={selectedSort}
        />
      </div>

      {/* ===== Mobile Bottom Bar ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] flex lg:hidden border-t border-gray-200 bg-white">
        <button
          onClick={() => {
            setShowFilterDrawer(true)
          }}
          className='flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 border-r border-gray-200'
        ><SlidersHorizontal size={16} />
          Filter
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setShowSortDrawer(true)
          }}
          className='flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700'
        ><ArrowUpDown size={16} />
          Sort
        </button>
      </div>

      {/* ===== Mobile Filter Drawer ===== */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilterDrawer(false)} />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            
            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">Filters</h2>
              <button onClick={() => setShowFilterDrawer(false)}>
                <X size={16} className='text-gray-500' />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <FilterSidebar
                category={category}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                isMobile={true}
              />
            </div>

            <div className="p-4 border-t border-gray-200 shrink-0">
              <button onClick={() => setShowFilterDrawer(false)} className='w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold'>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Mobile Sort Drawer ===== */}
      {showSortDrawer && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSortDrawer(false)} />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">

            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">Sort By</h2>
              <button onClick={() => setShowSortDrawer(false)}>
                <X size={16} className='text-gray-500' />
              </button>
            </div>

            <div className="p-3 pb-8 space-y-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedSort(option.value)
                    setShowSortDrawer(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedSort === option.value
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-800"
                    }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedSort === option.value ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {selectedSort === option.value && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 block" />
                    )}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
            <div className='h-4' />
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductListing
