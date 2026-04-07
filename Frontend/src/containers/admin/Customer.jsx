import { BlocksIcon, ChevronLeft, ChevronRight, Edit2, Eye, Plus, Search, Shield, Trash2, UserCheck, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createUser, deleteUser, getUsers, toggleUserStatus } from '../../features/user/userSlice';
import { motion, AnimatePresence } from 'framer-motion'
import ReactPaginate from 'react-paginate';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { toast } from 'react-toastify';
import AddUserModel from '../../components/admin/AddUserModel';


const Customer = () => {
  const dispatch = useDispatch();
  const { users, loading, total, totalPages } = useSelector(state => state.users);
  console.log(users);



  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [deleteUserId,setDeleteUserId] = useState(null);
  const [isAddModelOpen,setIsAddModelOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getUsers({page: currentPage + 1,limit: itemsPerPage, search: searchTerm}))
  }, [dispatch,currentPage,searchTerm])

  const openDeleteDialog = (id) => {
    setDeleteUserId(id);
    setIsDialogOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(deleteUserId)).unwrap();
      toast.success("User deleted successfully");
      dispatch(getUsers({page: currentPage + 1,limit: itemsPerPage, search: searchTerm}))
    } catch (error) {
      toast.error(error || "Failed to delete user")
    } finally {
      setIsDialogOpen(false);
      setDeleteUserId(null);
    }
  }

  const handleAddUser = async (data) => {
    try {
      await dispatch(createUser(data)).unwrap();
      toast.success("User Created successfully");

      dispatch(getUsers({page: currentPage + 1,limit: itemsPerPage,search: searchTerm}));
    } catch (error) {
      toast.error(error || "Failed to Create user");
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleUserStatus(id)).unwrap();
      toast.success("User status updated");
      dispatch(getUsers({page: currentPage + 1,limit: itemsPerPage,search: searchTerm}))
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  }

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setDeleteUserId(null);
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchrole =
      roleFilter === "" || u.role === roleFilter;

    const matchStatus =
      statusFilter === "" ||
      (statusFilter === 'active' && u.isActive) ||
      (statusFilter === 'block' && !u.isActive);

    return matchSearch && matchrole && matchStatus;
  });

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const stats = [
    { label: 'Total users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active users', value: users.filter(u => u.isActive).length, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Admins', value: users.filter(u => u.role === "admin").length, icon: Shield, color: 'bg-red-500' },
    { label: 'Block users', value: users.filter(u => !u.isActive).length, icon: BlocksIcon, color: 'bg-red-500' },
  ]

  // ============= Role Badge ===========
  const RoleBadge = ({ role }) => {
    const map = {
      admin: 'bg-violet-100 text-violet-700 border-violet-200',
      user: 'bg-sky-100 text-sky-700 border-sky-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${map[role] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {role}
      </span>
    )
  }

  // ============= Status Badge ===========
  const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isActive
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-red-50 text-red-600 border-red-200'
      }`}>
      {isActive ? 'Active' : 'Blocked'}
    </span>
  )

  // ============= Pagination Varinats ===========
  const paginationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20, duration: 0.5 }
    }
  }

  // ============= Relative Time ===========
  const timeAgo = (date) => {
    if (!date || date === null || date === undefined) return 'Never';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Never';
    const seconds = Math.floor((Date.now() - d) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }


  return (
    <div className="min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and monitor all users in your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {stats.map((stat, index) => (
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
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
          <div className="relative flex-1">
            <Search size={18} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type="text"
              placeholder='Search by name or email'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700'
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700'
            >
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="block">Block</option>
            </select>

            <button 
            onClick={() => setIsAddModelOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-blue-200">
              <Plus size={18} />
              Add user
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profileImage?.url ? (
                          <img
                            src={user.profileImage?.url}
                            alt={user.fullname}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold">
                            {user.fullname?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{user.fullname}</p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums whitespace-nowrap">{user.mobileNo}</td>

                    <td className='px-6 py-4'>
                      <RoleBadge role={user.role} />
                    </td>

                    <td className='px-6 py-4'>
                      <StatusBadge isActive={user.isActive} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{timeAgo(user.lastLogin)}</td>


                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap tabular-nums">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          title={user.isActive ? "Block User" : "Unblock User"}
                          onClick={() => handleToggleStatus(user._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive
                            ? "text-yellow-600 hover:text-yellow-800"
                            : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {user.isActive ? <BlocksIcon size={15} /> : <UserCheck size={15}/>}
                        </button>

                        <button
                          title="Delete"
                          onClick={() => openDeleteDialog(user._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
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

        <ConfirmDialog 
        isOpen={isDialogOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        />

        <AddUserModel 
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModelOpen(false)}
        onSave={handleAddUser}
        />
      </div>

    </div>
  )
}

export default Customer
