import { X } from 'lucide-react'
import React from 'react'

const ConfirmDialog = ({isOpen,title,message,onConfirm,onCancel}) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    onClick={onCancel}
                >
                    <X size={18} />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
                <p className="text-sm text-gray-500 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
