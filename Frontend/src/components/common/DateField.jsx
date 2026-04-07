import React from 'react'

const DateField = ({name,label,value,onChange,onBlur,error,touched}) => {
  return (
    <div className='mb-4'>
      {label && <label className='label-global'>{label}</label>}
      <input 
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`input-global ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
      />

      {
        error && touched && (
          <p className='input-error'>{error}</p>
        )
      }
    </div>
  )
}

export default DateField
