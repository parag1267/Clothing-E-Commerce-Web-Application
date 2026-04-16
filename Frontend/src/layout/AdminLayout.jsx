import {
  ChevronRight,
  CirclePlus,
  CircleUserRound,
  Folder,
  FolderTree,
  House,
  LogOut,
  NotebookTabs,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Sun,
  User
} from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 my-1 rounded-lg text-sm font-medium transition-all duration-200
   ${isActive
    ? "bg-[#EFF6FF] text-[#2563EB]"
    : "text-gray-600 hover:bg-[#EFF6FF] hover:text-[#1F2937]"
  }`;

const TITLES = {
  orders: "Order Management",
  customers: "Customers",
  brands: "Brands",
  addproduct: "Add Product",
  productlist: "Product List",
  categories: "Categories",
  subcategories: "SubCategories",
  settings: "Settings",
  profile: "My Profile",
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector(state => state.auth);


  const pageTitle =
    Object.entries(TITLES).find(([key]) =>
      location.pathname.includes(key)
    )?.[1] ?? "Dashboard";

  const handleLogout = () => {
    console.log("Logging out");
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#1F2937]">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col">
        <div
          className="flex items-center gap-2 cursor-pointer px-4 py-4.5 justify-center shadow-sm"
          onClick={() => navigate('/')}
        >
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-blue-500">Clothing</span>
            <span className="text-gray-900">Kart</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">

          <div className="my-2">
            <p className="text-gray-500 pb-1 uppercase text-xs tracking-wider">
              Main Menu
            </p>

            <NavLink to="/admin" className={linkClass} end>
              <House size={20} />
              Dashboard
            </NavLink>


            <NavLink to="/admin/customers" className={linkClass}>
              <User size={20} />
              Customers
            </NavLink>

          </div>

          <div className="my-2">
            <p className="text-gray-500 pb-1 uppercase text-xs tracking-wider">
              Products
            </p>

            <NavLink to="/admin/categories" className={linkClass}>
              <Folder size={20} />
              Categories
            </NavLink>

            <NavLink to="/admin/subcategories" className={linkClass}>
              <FolderTree size={20} />
              SubCategories
            </NavLink>

            <NavLink to="/admin/addproduct" className={linkClass}>
              <CirclePlus size={20} />
              Product
            </NavLink>

            <NavLink to="/admin/productlist" className={linkClass}>
              <NotebookTabs size={20} />
              Product List
            </NavLink>

          </div>

          <div className="my-2">
            <p className="text-gray-500 pb-1 uppercase text-xs tracking-wider">
              Orders
            </p>

            <NavLink to="/admin/orders" className={linkClass}>
              <ShoppingCart size={20} />
              Orders
            </NavLink>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200'>
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                {user?.profileImage?.url ? (
                  <img src={user.profileImage.url} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-white font-semibold uppercase text-sm">
                    {user?.fullname?.charAt(0) || "A"}
                  </span>
                )}
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.fullname || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@example.com"}
                </p>
              </div>

              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-90' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-slideUp">

                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setIsProfileOpen(false);
                  }}
                  className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors'>
                  <CircleUserRound size={16} />
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t'>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <div>
            <h4 className="text-2xl font-semibold">Welcome Back, {user?.fullname?.split(" ")[0] || "Admin"}!</h4>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
