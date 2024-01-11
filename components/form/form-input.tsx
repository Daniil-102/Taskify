'use client'

import React, { forwardRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { FormErrors } from './form-errors'

interface FromInputProps {
    id: string,
    label?: string,
    type?: string,
    placeholder?: string,
    required?: boolean,
    disabled?: boolean,
    errors?: Record<string, string[] | undefined>,
    className?: string,
    defaultValue?: string,
    onBlur?: () => void

}

export const FormInput = forwardRef<HTMLInputElement, FromInputProps>(({
    id, label, type, placeholder, required, disabled, errors, className, defaultValue, onBlur
}, ref) => {

    return (
        <div className="space-y-2">
            <div className="space-y-1">
                {label ? (
                    <Label htmlFor={id} className='text-xs font-semibold text-neutral-700'>
                        {label}
                    </Label>
                ) : null}
                <Input onBlur={onBlur}
                    defaultValue={defaultValue}
                    ref={ref}
                    required={required}
                    id={id}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    name={id}
                    className={cn('text-sm px-2 py-1 h-7', className)}
                    aria-describedby={`${id}-error`}
                />

            </div>
            <FormErrors
                id={id}
                errors={errors}
            />
        </div>
    )
})


FormInput.displayName = 'FormInput'