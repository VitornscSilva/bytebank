"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value: string
  onChange: (value: string, numericValue: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  required?: boolean
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, placeholder = "R$ 0,00", disabled, id, required, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")
    const [isFocused, setIsFocused] = React.useState(false)

    const formatCurrency = (num: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num)
    }

    React.useEffect(() => {
      if (value) {
        const numericValue = parseFloat(value)
        if (!isNaN(numericValue)) {
          setDisplayValue(formatCurrency(numericValue))
        }
      } else {
        setDisplayValue("")
      }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value
      
      let cleanValue = inputValue.replace(/[^\d]/g, '')
      
      if (cleanValue === '') {
        setDisplayValue("")
        onChange("", 0)
        return
      }

      const numericValue = parseInt(cleanValue) / 100
      const formattedValue = formatCurrency(numericValue)
      
      setDisplayValue(formattedValue)
      onChange(numericValue.toString(), numericValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      e.target.select()
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }
    }

    return (
      <input
        ref={ref}
        id={id}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-white border-gray-200 text-gray-900 font-medium",
          "hover:border-gray-300 focus:border-green-500 focus:ring-green-200",
          isFocused && "border-green-500 ring-2 ring-green-200",
          "text-left",
          className
        )}
        {...props}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput" 