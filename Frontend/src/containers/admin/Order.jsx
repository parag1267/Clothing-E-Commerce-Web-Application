import { CheckCircle, Clock, Eye, IndianRupee, PackageCheck, ShoppingBag, Truck, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrder, updateOrderStatus } from '../../features/order/orderSlice'

const statusStyles = {
  processing: 'bg-amber-50 text-amber-800',
  shipped: 'bg-blue-50 text-blue-800',
  delivered: 'bg-green-50 text-green-800',
  cancelled: 'bg-red-50 text-red-800',
}

const paymentStyles = {
  paid: 'bg-green-50 text-green-800',
  pending: 'bg-amber-50 text-amber-800',
  failed: 'bg-red-50 text-red-800',
}

const statList = (allOrders) => [
  {
    label: 'Total Orders',
    value: allOrders.length,
    icon: ShoppingBag,
    color: 'bg-blue-500'
  },
  {
    label: 'Total Revenue',
    value: '₹' + Math.round(
      allOrders
        .filter(o => o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
    ).toLocaleString('en-IN'),
    icon: IndianRupee,
    color: 'bg-green-500'
  },
  {
    label: 'Processing',
    value: allOrders.filter(o => o.orderStatus === "processing").length,
    icon: Clock,
    color: 'bg-red-500'
  },
  {
    label: 'Shipped',
    value: allOrders.filter(o => o.orderStatus === "shipped").length,
    icon: Truck,
    color: 'bg-red-500'
  },
  {
    label: 'Delivered',
    value: allOrders.filter(o => o.orderStatus === "delivered").length,
    icon: PackageCheck,
    color: 'bg-red-500'
  },
]

const Order = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  const { allOrders, loading, error, totalPages } = useSelector(state => state.order);
  console.log(allOrders)

  // const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOpenModel, setOpenModel] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      dispatch(fetchAllOrder({ page: currentPage + 1, limit: itemsPerPage }))
    }
  }, [dispatch, isAuthenticated, authLoading, currentPage])

  const handleStatus = async (id, status) => {
    if (!status) return
    setUpdatingId(id)
    await dispatch(updateOrderStatus({ id, status }))
    setUpdatingId(null)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenModel(true);
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and update status of all customer orders</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
        {statList(allOrders).map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>

              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="overflow-x-auto">
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {loading && allOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-sm text-gray-400">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    >
                      Loading orders...
                    </motion.span>
                  </td>
                </tr>
              )}

              {!loading && allOrders.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan="8" className="px-5 py-12 text-center text-sm text-gray-400">
                    No orders found.
                  </td>
                </motion.tr>
              )}
              <AnimatePresence>
                {allOrders.map((order, index) => {
                  const isUpdating = updatingId === order._id
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`transition-colors ${isUpdating ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500">
                          #{order._id.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800 text-sm">
                          {order.user?.fullname || '—'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.user?.email || ''}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ₹{Math.round(Number(order.totalAmount)).toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStyles[order.paymentInfo?.status] || 'bg-gray-50 text-gray-600'}`}>
                          {order.paymentInfo?.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {order.paymentInfo?.method} - card
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <AnimatePresence mode='wait'>
                          <motion.span
                            key={isUpdating ? 'updating' : order.orderStatus}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.15 }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isUpdating
                              ? 'bg-gray-100 text-gray-500'
                              : statusStyles[order.orderStatus] || 'bg-gray-50 text-gray-600'
                              }`}
                          >
                            {isUpdating ? 'Updating...' : order.orderStatus}
                          </motion.span>
                        </AnimatePresence>
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="View order details"
                            className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors'
                            onClick={() => handleViewOrder(order)}>
                            <Eye size={15} />
                          </motion.button>

                          {order.orderStatus === "processing" && (
                            <>
                              <motion.button
                                whileHover={{ scale: isUpdating ? 1 : 1.05 }}
                                whileTap={{ scale: isUpdating ? 1 : 0.95 }}
                                title="Mark as shipped"
                                disabled={isUpdating}
                                onClick={() => handleStatus(order._id, 'shipped')}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Truck size={13} />
                                {isUpdating ? '...' : 'Ship'}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: isUpdating ? 1 : 1.05 }}
                                whileTap={{ scale: isUpdating ? 1 : 0.95 }}
                                title="Cancle order"
                                disabled={isUpdating}
                                onClick={() => handleStatus(order._id, 'cancelled')}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <XCircle size={15} />
                              </motion.button>
                            </>
                          )}

                          {order.orderStatus === "shipped" && (
                            <motion.button
                              whileHover={{ scale: isUpdating ? 1 : 1.05 }}
                              whileTap={{ scale: isUpdating ? 1 : 0.95 }}
                              title="Mark as delivered"
                              disabled={isUpdating}
                              onClick={() => handleStatus(order._id, 'delivered')}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle size={13} />
                              {isUpdating ? '...' : 'Deliver'}
                            </motion.button>
                          )}

                          {(order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') && (
                            <span className="text-xs text-gray-300 italic">—</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Page {' '}
                  <span className="font-semibold text-gray-700">{currentPage + 1}</span>
                  {' '}of{' '}
                  <span className="font-semibold text-gray-700">{totalPages}</span>
                  <span className="ml-2 text-gray-400">({total} users)</span>
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

        {isOpenModel && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Order details</h2>
                <button
                  onClick={() => setOpenModel(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Order Meta */}
              <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-gray-100">
                {[
                  { label: "Order ID", value: `#${selectedOrder._id}` },
                  { label: "Total amount", value: `₹${selectedOrder.totalAmount}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-900">{value}</p>
                  </div>
                ))}

                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-gray-500 mb-1">Order status</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {selectedOrder.orderStatus}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {selectedOrder.paymentInfo?.status}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Shipping address</p>

                <div className="px-6 py-4 border-b border-gray-100 mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">Customer</p>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.user?.fullname}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                </div>

                <p className="text-sm font-medium text-gray-900">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-sm text-gray-500">{selectedOrder.shippingAddress?.phone}</p>
                <p className="text-sm text-gray-500">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                </p>
              </div>

              {/* Products */}
              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 mb-3">Products</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 ${index < selectedOrder.items.length - 1 ? "pb-3 border-b border-gray-100" : ""
                        }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>


  )
}

export default Order
