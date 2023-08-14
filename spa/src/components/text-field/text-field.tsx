'use client'

import classNames from 'classnames'
import { ChangeEventHandler, HTMLInputTypeAttribute, useId } from 'react'

type TTextFieldProps = {
  label?: string
  type?: HTMLInputTypeAttribute
  onChange: ChangeEventHandler<HTMLInputElement>
  value: string | number
  error?: boolean
  helperText?: string
}

export function TextField({
  label,
  type = 'text',
  onChange,
  value,
  error = false,
  helperText
}: TTextFieldProps) {
  const uuid = useId()

  const inputClasses = classNames(
    'px-4 py-2 border rounded-md',
    {
      'border-red-500': error
    }
  )

  return (
    <div className="flex flex-col">
      {label && (
        <label
          className="text-sm text-slate-600"
          htmlFor={`input-${uuid}`}
        >
          {label}
        </label>
      )}
      <input
        id={`input-${uuid}`}
        className={inputClasses}
        type={type}
        onChange={onChange}
        value={value}
      />
      {helperText && (
        <span className={error ? 'text-red-500' : ''}>
          {helperText}
        </span>
      )}
    </div>
  )
}
