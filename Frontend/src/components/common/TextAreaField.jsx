import React from 'react'

const TextAreaField = ({
    name,
    label,
    type = 'textarea',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched
}) => {
    return (
        <div className='mb-4'>
            {label && <label className='label-global'>{label}</label>}

            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`input-global ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-400 focus:border-gray-400 focus:ring-gray-400'}`}
            />

            {error && touched && (
                <p className='input-error'>{error}</p>
            )}
        </div>
    )
}

export default TextAreaField
