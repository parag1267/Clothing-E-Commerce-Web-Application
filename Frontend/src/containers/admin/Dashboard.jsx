import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrder } from '../../features/order/orderSlice';
import { fetchProducts } from '../../features/products/productSlice';
import { getUsers } from '../../features/user/userSlice';
import { CheckCircle, Clock, IndianRupee, Package, RefreshCw, ShoppingBag, Users, XCircle } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Dashboard = () => {
  const dispatch = useDispatch();
  const { allOrders = [], error: orderError } = useSelector(state => state.order);
  const { products = [], error: productError } = useSelector(state => state.products);
  const { users = [], error: userError } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchAllOrder({ page: 1, limit: 1000, search: '' }))
    dispatch(fetchProducts({ tab: '', category: '', page: 1, limit: 1000 }))
    dispatch(getUsers({ page: 1, limit: 1000, search: '' }))
  }, [dispatch])

  // =========== Revenue =========
  const revunue = Math.round(
    allOrders.filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
  ).toLocaleString('en-IN')

  // =========== Monthly Chart =========
  const currentYear = new Date().getFullYear()
  const monthlyData = MONTHS.map((month, i) => {
    const monthOrders = allOrders.filter(o => {
      const d = new Date(o.createdAt)
      return d.getMonth() === i && d.getFullYear() === currentYear
    })
    return {
      month,
      revenue: Math.round(
        monthOrders
          .filter(o => o.orderStatus !== 'cancelled')
          .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
      ),
      orders: monthOrders.length,
    }
  })

  // =========== Order Status Chart Data =========
  const statusData = [
    {
      name: 'Pending',
      value: allOrders.filter(o => o.orderStatus === 'pending').length
    },
    {
      name: 'Processing',
      value: allOrders.filter(o => o.orderStatus === 'processing').length
    },
    {
      name: 'Delivered',
      value: allOrders.filter(o => o.orderStatus === 'delivered').length
    },
    {
      name: 'Cancelled',
      value: allOrders.filter(o => o.orderStatus === 'cancelled').length
    },
  ]

  // =========== Recent orders (last 8) =========
  const recentOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)

  const statusStyle = {
    pending: 'bg-yellow-50 text-yellow-700',
    processing: 'bg-blue-50 text-blue-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    shipped: 'bg-purple-50 text-purple-700',
  }

  const stats = [
    {
      label: 'Total revenue',
      value: '₹' + revunue,
      sub: `${allOrders.filter(o => o.orderStatus !== 'cancelled').length} paid orders`,
      icon: IndianRupee,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total orders',
      value: allOrders.length,
      sub: 'All time orders',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total customers',
      value: users.length,
      sub: 'Registered users',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total products',
      value: products.length,
      sub: 'Listed products',
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Pending',
      value: allOrders.filter(o => o.orderStatus === 'pending').length,
      sub: 'Awaiting confirm',
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Processing',
      value: allOrders.filter(o => o.orderStatus === 'processing').length,
      sub: 'Being prepared',
      icon: RefreshCw,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Delivered',
      value: allOrders.filter(o => o.orderStatus === 'delivered').length,
      sub: 'Successfully done',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Cancelled',
      value: allOrders.filter(o => o.orderStatus === 'cancelled').length,
      sub: 'Refund processed',
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]
  return (
    <div className="min-h-full space-y-6">
      {orderError || productError || userError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {orderError || productError || userError}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Monthly revenue
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id='revenueGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => '₹' + v.toLocaleString('en-IN')} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke='#22c55e'
                strokeWidth={2}
                fill='url(#revenueGrud)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Order status overview
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} barSize={36}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                name="Orders"
                radius={[4, 4, 0, 0]}
                fill='#6366f1'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Recent orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                    #{order._id.toUpperCase()}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{order.user?.fullname || '—'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
