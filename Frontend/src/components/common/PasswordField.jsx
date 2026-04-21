import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'

const PasswordField = ({ name, label, placeholder, onChange, onBlur, error, touched }) => {
    const [show, setShow] = useState(true);
    return (
        <div className='mb-4'>
            {label && <label className='label-global'>{label}</label>}

            <div className="relative flex items-center">
                <input
                    name={name}
                    type={show ? "password" : "text"}
                    placeholder={placeholder}
                    className={`input-global ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-blue-400 focus:border-blue-400 focus:ring-blue-400'}`}
                    onChange={onChange}
                    onBlur={onBlur}
                />

                <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 flex items-center justify-center' onClick={() => setShow(!show)}>
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && touched && (
                    <p className='input-error'>{error}</p>
                )}
        </div>
    )
}

export default PasswordField
