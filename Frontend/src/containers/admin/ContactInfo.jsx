import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Mail, MailOpen, Inbox, Phone, User, Clock, CheckCheck } from 'lucide-react'
import { fetchAllMessages,markMessage} from '../../features/contact/contactSlice'


const statusStyles = {
  unread: 'bg-amber-50 text-amber-800',
  read:   'bg-green-50 text-green-800',
}

// ─── Stats List ──────────────────────────────────────────
const statList = (messages) => [
  {
    label: 'Total Messages',
    value: messages.length,
    icon: Inbox,
    color: 'bg-blue-500'
  },
  {
    label: 'Unread',
    value: messages.filter(m => m.status === 'unread').length,
    icon: Mail,
    color: 'bg-amber-500'
  },
  {
    label: 'Read',
    value: messages.filter(m => m.status === 'read').length,
    icon: MailOpen,
    color: 'bg-green-500'
  },
]

const ContactInfo = () => {
  const dispatch = useDispatch()
  const { allMessages, loading, error } = useSelector(state => state.contact)
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth)

  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isOpenModel, setOpenModel] = useState(false)
  const [activeTab, setActiveTab] = useState('all') 
  const [markingId, setMarkingId] = useState(null)

  // ─── Fetch Messages ───────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      dispatch(fetchAllMessages())
    }
  }, [dispatch, isAuthenticated, authLoading])

  // ─── Filter by Tab ────────────────────────────────────
  const filteredMessages = activeTab === 'unread'
    ? allMessages.filter(m => m.status === 'unread')
    : allMessages

  // ─── View + Auto Mark As Read ─────────────────────────
  const handleViewMessage = async (message) => {
    setSelectedMessage(message)
    setOpenModel(true)

    if (message.status === 'unread') {
      setMarkingId(message._id)
      await dispatch(markMessage(message._id))
      setMarkingId(null)
    }
  }

  return (
    <div className="min-h-full">

      {/* ── Page Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all contact form submissions
        </p>
      </div>

      {/* ── Error ─────────────────────────────────────── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Stats Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {statList(allMessages).map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
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

      {/* ── Table Card ────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">

        {/* ── Tabs ──────────────────────────────────── */}
        <div className="flex gap-2 mb-4">
          {['all', 'unread'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize
                ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab === 'all' ? 'All Messages' : 'Unread'}
            </button>
          ))}
        </div>

        {/* ── Table ─────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Email', 'Phone', 'Message', 'Status', 'Date', 'Action'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {/* Loading */}
              {loading && allMessages.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-gray-400">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    >
                      Loading messages...
                    </motion.span>
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && filteredMessages.length === 0 && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-gray-400">
                    No messages found.
                  </td>
                </motion.tr>
              )}

              {/* Rows */}
              <AnimatePresence>
                {filteredMessages.map((msg, index) => (
                  <motion.tr
                    key={msg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-colors hover:bg-gray-50 
                      ${msg.status === 'unread' ? 'font-medium' : 'font-normal'}`}
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 
                                        flex items-center justify-center text-xs font-semibold">
                          {msg.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-800">{msg.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-sm text-gray-500">{msg.email}</td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-sm text-gray-500">{msg.phone}</td>

                    {/* Message Preview */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-[180px]">
                        {msg.message}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 
                        rounded-full text-xs font-medium ${statusStyles[msg.status]}`}>
                        {msg.status === 'unread'
                          ? <Mail size={10} className="mr-1" />
                          : <MailOpen size={10} className="mr-1" />
                        }
                        {msg.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="View message"
                        onClick={() => handleViewMessage(msg)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 
                                   text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Eye size={15} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────── */}
      {isOpenModel && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Message Details</h2>
              <button
                onClick={() => setOpenModel(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Sender Info */}
            <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-gray-100">
              {[
                { label: 'Name',  value: selectedMessage.name,  icon: User  },
                { label: 'Phone', value: selectedMessage.phone, icon: Phone },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                    <Icon size={10} /> {label}
                  </p>
                  <p className="text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}

              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                  <Mail size={10} /> Email
                </p>
                <p className="text-sm font-medium text-gray-900">{selectedMessage.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Clock size={10} /> Received
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedMessage.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div className="px-6 py-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Message</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 
                            rounded-lg p-4 border border-gray-100">
                {selectedMessage.message}
              </p>
            </div>

            {/* Read indicator */}
            {selectedMessage.readAt && (
              <div className="px-6 pb-4 flex items-center gap-1 text-xs text-green-600">
                <CheckCheck size={13} />
                Read on {new Date(selectedMessage.readAt).toLocaleDateString('en-IN')}
              </div>
            )}

          </motion.div>
        </div>
      )}

    </div>
  )
}

export default ContactInfo