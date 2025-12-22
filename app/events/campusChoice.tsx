"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const campuses = [
  {
    value: "dale_mabry",
    label: "Dale Mabry Campus",
  },
  {
    value: "hawkslanding",
    label: "Hawks Landing",
  },
]

interface ComboboxDemoProps {
  selectedValues?: string[]
  onSelectedValuesChange: (values: string[]) => void
}

export default function ComboboxDemo({
  selectedValues = [],
  onSelectedValuesChange,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false)

  const toggleValue = (value: string) => {
    const currentValues = selectedValues || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    onSelectedValuesChange(newValues)
    console.log(newValues)
  }

  const getButtonText = () => {
    const values = selectedValues || []
    if (values.length === 0) {
      return "Select campus..."
    }
    if (values.length === campuses.length) {
      return "All campuses"
    }
    if (values.length === 1) {
      return campuses.find((campus) => campus.value === values[0])?.label
    }
    return `${values.length} campuses selected`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[200px] justify-between"
        >
          {getButtonText()}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] sm:w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No campus found.</CommandEmpty>
            <CommandGroup>
              {campuses.map((campus) => (
                <CommandItem
                  key={campus.value}
                  value={campus.value}
                  onSelect={() => {
                    toggleValue(campus.value)
                  }}
                >
                  {campus.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      (selectedValues || []).includes(campus.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
