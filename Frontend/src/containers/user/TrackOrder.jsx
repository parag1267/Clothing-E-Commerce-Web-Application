import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearOrderState, fetchMyOrder, fetchSingleOrder } from '../../features/order/orderSlice'
import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const fmt = (n) => '₹' + n.toLocaleString('en-IN')

const statusStyles = {
    pending: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
}

const dotStyles = {
    done: 'bg-blue-600 border-blue-600',
    active: 'bg-blue-600 border-blue-600 ring-4 ring-blue-200',
    pending: 'bg-white border-gray-300',
}

const buildTimeline = (order) => {
    const steps = [
        { key: 'processing', label: 'Order placed', desc: 'We received your order.' },
        { key: 'processing', label: 'Payment confirmed', desc: `Payment of ${fmt(order.totalAmount)} verified.` },
        { key: 'processing', label: 'Processing', desc: 'Items packed and ready.' },
        { key: 'shipped', label: 'Shipped', desc: '' },
        { key: 'delivered', label: 'Out for delivery', desc: '' },
        { key: 'delivered', label: 'Delivered', desc: order.deliveredAt ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : '' }
    ]

    const rank = { processing: 1, shipped: 2, delivered: 3, cancelled: 4 }
    const current = rank[order.orderStatus?.toLowerCase()] ?? 0

    if (order.orderStatus?.toLowerCase() === 'cancelled') {
        return [
            { label: 'Order placed', time: new Date(order.createdAt).toLocaleString(), desc: '', state: 'done' },
            { label: 'Cancelled', time: order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : '', desc: 'Order was cancelled.', state: 'active' },
        ]
    }

    return steps.map((step, i) => {
        const stepRank = rank[step.key]
        let state = 'pending'
        if (stepRank < current) state = "done"
        else if (stepRank === current) state = i === steps.filter(s => rank[s.key] === stepRank).length - 1 ? 'active' : 'done'
        return {
            label: step.label,
            desc: step.desc,
            time: stepRank <= current ? new Date(order.createdAt).toLocaleString() : 'Pending',
            state
        }
    })
}

const OrderCard = ({ order, isSelected, onClick }) => {
    return <div
        onClick={() => onClick(order._id)}
        className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected
            ? 'border-blue-500 bg-blue-50'   // selected order highlight
            : 'border-gray-100 bg-white hover:border-gray-300'
            }`}
    >
        <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 font-mono">
                #{order._id}
            </p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[order.orderStatus?.toLowerCase()] || 'bg-gray-100 text-gray-600'
                }`}>
                {order.orderStatus}
            </span>
        </div>

        <p className="text-sm font-medium text-gray-900 mb-1">
            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
        </p>

        <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                })}
            </p>
            <p className="text-sm font-medium text-gray-900">{fmt(order.totalAmount)}</p>
        </div>
    </div>
}

const TrackOrder = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orders, currentOrder, loading, error } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(fetchMyOrder())
        return () => dispatch(clearOrderState())
    }, [dispatch])

    useEffect(() => {
        if (orders.length > 0 && !currentOrder) {
            dispatch(fetchSingleOrder(orders[0]._id))
        }
    }, [orders, dispatch, currentOrder])

    const handleSelectOrder = (id) => {
        dispatch(fetchSingleOrder(id))
    }

    const o = currentOrder;

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded mt-2 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse flex gap-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-6xl mx-auto">

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                            My Orders
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">0 orders placed</p>
                    </div>

                    {/* Empty Card */}
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl py-20 px-6 gap-4">
                        <div className="bg-white p-6 rounded-full shadow-sm">
                            <ShoppingBag size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700">No orders yet</h3>
                        <p className="text-sm text-gray-400 text-center max-w-xs">
                            Looks like you haven't placed any orders yet. Start shopping and your orders will appear here.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition"
                        >
                            Start Shopping
                        </button>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
                My Orders
            </h1>

            <p className="text-sm text-gray-600 mb-6">
                {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-4">
                {/* All Order list */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-1">
                        All Orders
                    </p>

                    <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
                        {orders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                isSelected={o?._id === order._id}
                                onClick={handleSelectOrder}
                            />
                        ))}
                    </div>
                </div>

                {o ? (
                    <>
                        {/* Order Details */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white border border-gray-100 rounded-xl p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            #{o._id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Place on</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                            {o.paymentInfo?.method} · {o.paymentInfo?.status}
                                        </p>
                                    </div>

                                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusStyles[o.orderStatus?.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                                        {o.orderStatus}
                                    </span>
                                </div>


                                <p className="text-sm font-medium text-gray-900 mb-3">Order Items</p>

                                <div>
                                    {o.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                                            <div className="w-12 h-12 rounded-lg bg-gray-50 shrink-0 overflow-hidden">
                                                {item.image
                                                    ? <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                                    : <div className="w-full h-full flex items-center justify-center text-xl">👕</div>
                                                }
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Size: {item.size} · Qty: {item.quantity}
                                                </p>
                                            </div>

                                            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                                {fmt(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white border border-gray-100 rounded-xl p-5">
                                    <p className="text-sm font-medium text-gray-900 mb-4">Price Summary</p>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Subtotal</span>
                                            <span>{fmt(o.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Shipping</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium text-gray-900 pt-3 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>{fmt(o.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order timeline */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white border border-gray-100 rounded-xl p-5">
                                <p className="text-sm font-medium text-gray-900 mb-4">Order Timeline</p>
                                <div className="relative pl-7">
                                    <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gray-200" />

                                    {buildTimeline(o).map((step, i) => (
                                        <div key={i} className="relative mb-5 last:mb-0">
                                            <div className={`absolute -left-7 top-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${dotStyles[step.state]}`}>
                                                {(step.state === "done" || step.state === "active") && (
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </div>

                                            <p className={`text-sm font-medium leading-tight ${step.state === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                                                {step.label}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                                            {step.desc && <p className="text-xs text-gray-500 mt-1">{step.desc}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-xl p-5">
                                <p className="text-sm font-medium text-gray-900 mb-3">Shipping Address</p>
                                <div className="bg-gray-50 rounded-lg p-3 space-y-0.5">
                                    <p className="text-xs text-gray-400 mb-1">Delivering to</p>
                                    <p className="text-sm font-medium text-gray-900">{o.shippingAddress?.fullname}</p>
                                    <p className="text-sm text-gray-500">{o.shippingAddress?.address}</p>
                                    <p className="text-sm text-gray-500">
                                        {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                                    </p>
                                    <p className="text-sm text-gray-500">{o.shippingAddress?.phone}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="lg:col-span-2 flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400 text-sm">Select an order to view details</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TrackOrder
