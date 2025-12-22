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

export const upcomingPastOptions = [
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "past",
    label: "Past",
  },
]

interface UpcomingPastChoiceProps {
  selectedValues?: string
  onSelectedValuesChangeUpcoming: (values: string) => void
}

export default function UpcomingPastChoice({
  selectedValues = "",
  onSelectedValuesChangeUpcoming,
}: UpcomingPastChoiceProps) {
  const [open, setOpen] = React.useState(false)

  const toggleValue = (value: string) => {
    onSelectedValuesChangeUpcoming(value)
    setOpen(false)
  }

  const getButtonText = () => {
    if (!selectedValues || selectedValues === "") {
      return "Select time period..."
    }
    return upcomingPastOptions.find((option) => option.value === selectedValues)?.label || "Select time period..."
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
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {upcomingPastOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    toggleValue(option.value)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValues === option.value
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
