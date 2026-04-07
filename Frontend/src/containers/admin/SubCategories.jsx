import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import SubCategoriesCard from '../../components/admin/subcategories/SubCategoriesCard';
import SubCategoriesModel from '../../components/admin/subcategories/SubCategoriesModel';
import { addSubCategories, deleteSubCategories, fetchSubCategories, updateSubCategories } from '../../features/subcategories/subCategoriesSlice';
import { toast } from 'react-toastify';

const SubCategories = () => {
  const dispatch = useDispatch();

  const { subCategories, loading } = useSelector(state => state.subCategory);

  useEffect(() => {
    dispatch(fetchSubCategories())
  }, [dispatch])

  const [showModel, setShowModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingCategory, setEditingCategory] = useState(null);

  const tabs = ['all', ...new Set(subCategories.map(item => item.category?.name).filter(Boolean))];


  const openEdit = (subCategory) => {
    setEditingCategory(subCategory);
    setShowModel(true);
  }

  const closeModal = () => {
    setShowModel(false);
    setEditingCategory(null);
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      console.log("Delete id:", id);
      try {
        await dispatch(deleteSubCategories(id)).unwrap();
        toast.success("Category deleted successfully")
      } catch (error) {
        toast.error(error || "Delete failed")
      }
    }
  }

  const handleSave = async (values) => {
    try {
      if (editingCategory) {
        await dispatch(updateSubCategories({
          id: editingCategory._id,
          data: values
        })).unwrap();
        toast.success("SubCategory updated successfully");
      }
      else {
        await dispatch(addSubCategories(values)).unwrap();
        toast.success("SubCategory added successfully");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  }


  // Filter categories
  const filteredCategories = subCategories.filter(cat => {
    // Tab filter
    const matchesTab = activeTab === 'all' || cat.category?.name === activeTab;

    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesTab && matchesSearch;
  })
  return (
    <div className='min-h-full'>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          SubCategories Management
        </h1>
        <p className='text-sm text-gray-500 mt-1'>
          Manage your product sub-categories and collections
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowModel(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm'>
          <Plus size={18} />
          Add New Category
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
            <input
              type="text"
              placeholder='Search categories by name or description....'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition' />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading categories....</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <AnimatePresence>
                {filteredCategories.map((item, index) => (
                  <SubCategoriesCard
                    key={item._id}
                    subCategory={item}
                    index={index}
                    openEditModel={openEdit}
                  handleDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>

            {showModel && (
              <SubCategoriesModel
                isOpen={showModel}
                onClose={closeModal}
                onSave={handleSave}
                editingCategory={editingCategory}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SubCategories
