import React from 'react'

const SelectField = ({ label, options = [], value, onChange,onBlur, name,error,touched,disabled }) => {
  return (
    <div className='mb-4'>
      {label && <label className='label-global'>{label}</label>}

      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`input-global ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
      >
        <option value="">Select {label}</option>
        {
          options.map((optn, index) => (
            <option key={index} value={optn.value}>
              {optn.label}
            </option>
          ))
        }
      </select>

      {
        error && touched && (
          <p className='input-error'>{error}</p>
        )
      }
    </div>
  )
}

export default SelectField
