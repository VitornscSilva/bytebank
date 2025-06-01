"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Selecione uma data",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white hover:bg-gray-50 transition-all duration-200",
            !date && "text-muted-foreground",
            "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? (
            <span className="text-gray-900">
              {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white shadow-xl border border-gray-200 rounded-lg"
        align="start"
      >
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h4 className="font-medium text-sm text-gray-700">Selecionar Data</h4>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onSelect(selectedDate)
            setOpen(false)
          }}
          locale={ptBR}
          initialFocus
          className="p-0"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: "text-sm font-semibold text-gray-800",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-8 w-8 bg-transparent p-0 text-gray-600 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors duration-200"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex mb-2",
            head_cell: "text-gray-500 rounded-md w-9 font-medium text-xs uppercase tracking-wide",
            row: "flex w-full mt-1",
            cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200",
              "focus:bg-blue-100 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            ),
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:text-white shadow-md",
            day_today: "bg-gray-100 text-gray-900 font-semibold",
            day_outside: "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
            day_disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent",
          }}
        />
      </PopoverContent>
    </Popover>
  )
} 