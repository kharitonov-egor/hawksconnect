import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from 'moment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function TimeConverter(time: string, state:string) {

  const strippedTime = moment(time).format("LT")
  console.log(strippedTime)

  if (strippedTime.includes(":00")) {
    if (state == "startonly") {
      return moment(time).format("h A")
    }
    if (state == "start") {
      return moment(time).format("h")
    } else return moment(time).format("h A")

  }
  return moment(time).format("LT")
}
