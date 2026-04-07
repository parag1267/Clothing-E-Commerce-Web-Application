import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const SubCategoriesCard = ({subCategory,index,openEditModel,handleDelete}) => {
    if(!subCategory) return null;
    return (
    <motion.div
            key={subCategory._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className='group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300'>


            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img src={subCategory.images?.url || "https://via.placeholder.com/300"} alt={subCategory.category?.name} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' />

                <div className="absolute inset-0 bg-black bg:opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">

                    <button onClick={() => openEditModel(subCategory)} className='p-2 bg-white rounded-full hover:bg-blue-500 hover:text-white transition'>
                        <Edit size={16} />
                    </button>

                    <button onClick={() => handleDelete(subCategory._id)} className='p-2 bg-white rounded-full hover:bg-blue-500 hover:text-white transition'>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                        {subCategory.name}
                    </h3>
                    <span className={`
                          px-2 py-1 rounded-full text-xs font-medium ${subCategory.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                          `}>
                        {subCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {subCategory.category?.name}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button onClick={() => openEditModel(subCategory)} className='text-xs text-blue-600 hover:text-blue-700 font-medium'>
                        Edit Details
                    </button>
                </div>
            </div>
        </motion.div>
  )
}

export default SubCategoriesCard
