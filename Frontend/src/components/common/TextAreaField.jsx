import React from 'react'

const TextAreaField = ({
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    rows = 4
}) => {
    return (
        <div className='mb-4'>
            {label && <label className='label-global'>{label}</label>}

            <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                className={`input-global ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-blue-400 focus:border-blue-400 focus:ring-blue-400'}`}
            />

            {error && touched && (
                <p className='input-error'>{error}</p>
            )}
        </div>
    )
}

export default TextAreaField
