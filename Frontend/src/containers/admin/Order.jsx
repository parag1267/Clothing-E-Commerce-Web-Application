import React from 'react'
import OrderPaginationButton from '../../components/admin/OrderPaginationButton'

const Order = () => {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-4 gap-6'>
        <div className="bg-white rounded-xl shadow p-6">
          <p className='text-gray-500 text-sm font-semibold'>Total Orders</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>1000</p>
          <p className='text-gray-400 text-xs mt-1'>Last 7 Days</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className='text-gray-500 text-sm font-semibold'>New Orders</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>2000</p>
          <p className='text-gray-400 text-xs mt-1'>Last 7 Days</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className='text-gray-500 text-sm font-semibold'>Pending Orders</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>1600</p>
          <p className='text-gray-400 text-xs mt-1'>Last 7 Days</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className='text-gray-500 text-sm font-semibold'>Completed Orders</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>1700</p>
          <p className='text-gray-400 text-xs mt-1'>Last 7 Days</p>
        </div>
      </div>

      <div className='bg-white p-6 rounded-xl shadow'>
        <div className="overflow-x-auto">
          <table className='w-full text-sm'>
            <thead className='bg-green-50 text-gray-700'>
              <tr>
                <th className='p-3 text-center'>Order Id</th>
                <th className='p-3 text-center'>Product Name</th>
                <th className='p-3 text-center'>Date</th>
                <th className='p-3 text-center'>Price</th>
                <th className='p-3 text-center'>Payment</th>
                <th className='p-3 text-center'>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center font-semibold'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>

              <tr className='border-b border-gray-400'>
                <td className='p-3 text-center'>1</td>
                <td className='p-3 text-center'>Cloth</td>
                <td className='p-3 text-center'>01/02/2026</td>
                <td className='p-3 text-center'>₹ 1600</td>
                <td className='p-3 text-center'>Paid</td>
                <td className='p-3 text-center'>Pending</td>
              </tr>
            </tbody>
          </table>


          <div className="flex justify-center">
            <OrderPaginationButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
