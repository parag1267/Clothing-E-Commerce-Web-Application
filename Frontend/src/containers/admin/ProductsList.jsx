import React, { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2, Package, Search, Filter, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../features/products/productSlice'
import { useNavigate, useParams } from 'react-router-dom'

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const itemsPerPage = 10

  const {products,loading,totalPages,counts} = useSelector(state => state.products);
  
  useEffect(() => {
    let categoryFilter = "";

    if(activeTab === "men") categoryFilter = "men";
    else if(activeTab === "women") categoryFilter = "women";
    else categoryFilter = "";

    dispatch(fetchProducts({
      tab: ["active","inactive","isNewArrival","trending"].includes(activeTab)
        ? activeTab
        : "",
      page: currentPage + 1,
      limit: itemsPerPage,
      category: categoryFilter
    }))
  },[dispatch,activeTab,currentPage])

  // Filter products based on active tab and search
  const filteredProducts = useMemo(() => { 
    let data = [...products];
    if(activeTab === "active"){
      data = data.filter(p => p.isActive)
    }
    else if(activeTab === "inactive"){
      data = data.filter(p => !p.isActive)
    }
    else if(activeTab === "isNewArrival"){
      data = data.filter(p => p.isNewArrival)
    }
    else if(activeTab === "trending"){
      data = data.filter(p => p.isTrending)
    }
    
    // Search filtering
    if (searchTerm) {
      data = data.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return data;
  }, [activeTab,searchTerm, products])


  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id))
    }
  }

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const tabs = [
    { id: 'all', label: 'All Products', icon: Package, count: counts?.all || 0 },
    { id: 'men', label: 'All Men', icon: null, count: counts?.men || 0 },
    { id: 'women', label: 'All Women', icon: null, count: counts?.women || 0 },
    { id: 'active', label: 'Active', icon: null, count: counts?.active || 0 },
    { id: 'inactive', label: 'Inactive', icon: null, count: counts?.inactive || 0 },
    { id: 'isNewArrival', label: 'isNewArrival', icon: null, count: counts?.isNewArrival || 0 },
    { id: 'trending', label: 'Trending', icon: null, count: counts?.trending || 0},
  ]

  const paginationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20, duration: 0.5 }
    }
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all your products, variants, and inventory</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setCurrentPage(0)
                }}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {tab.icon && <tab.icon size={16} />}
                  <span>{tab.label}</span>
                  <span className={`
                    ml-2 px-2 py-0.5 text-xs rounded-full
                    ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products by name, brand, or category..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(0)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              
            </div>
            
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-275 w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 max-w-91.75">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{product.category.name}</p>
                        <p className="text-xs text-gray-500">{product.subCategory.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">₹{product.price}</p>
                        {product.discountPercentage > 0 && (
                          <p className="text-xs text-green-600">
                            {product.discountPercentage}% off
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-50">
                      <div className="flex items-center gap-1">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${product.sizes.reduce((sum, v) => sum + v.stock, 0) > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {product.sizes.reduce((sum, v) => sum + v.stock, 0)} units
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.sizes.map((s,i) => (
                          <span key={i} className={`px-2 py-0.5 text-xs rounded ${
                            s.stock > 0
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                            {s.size}: {s.stock}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isActive && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            New Arrival
                          </span>
                        )}
                        {product.isTrending && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Trending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded transition" onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
                          <Edit size={18}/>
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {activeTab === "all" ? "No products found" : `No ${activeTab} products`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search' : activeTab === "all" 
                          ? 'Get started by adding a new product' : `There are no ${activeTab} products available`}
            </p>
            {!searchTerm && (
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => navigate('/admin/addproduct')}>
                Add Product
              </button>
            )}
          </div>
        ):  null}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Page {currentPage + 1} of {totalPages}
                {selectedProducts.length > 0 && (
                  <span className="ml-2 font-medium text-blue-600">
                    ({selectedProducts.length} selected)
                  </span>
                )}
              </div>
              <motion.div
                variants={paginationVariants}
                initial="hidden"
                animate="visible"
              >
                <ReactPaginate
                  breakLabel={<span className='mx-2 text-gray-400'>...</span>}
                  nextLabel={
                    <span className='w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow-sm'>
                      <ChevronRight size={16} />
                    </span>
                  }
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={totalPages}
                  forcePage={currentPage}
                  previousLabel={
                    <span className='w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow-sm'>
                      <ChevronLeft size={16} />
                    </span>
                  }
                  containerClassName='flex items-center gap-1'
                  pageClassName='block'
                  pageLinkClassName='w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm'
                  activeLinkClassName='bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                  disabledClassName='opacity-50 cursor-not-allowed'
                  renderOnZeroPageCount={null}
                />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsList