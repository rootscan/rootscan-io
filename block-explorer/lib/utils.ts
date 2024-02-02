import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (number: number) => {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 18 }).format(
    number
  )
}

export const formatNumberDollars = (
  number: number,
  maximumFractionDigits?: number
) => {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maximumFractionDigits || 4,
  })
  return USDollar.format(number)
}

export const getPaginationData = (data: any) => {
  const a = structuredClone(data)
  if (a?.docs) {
    delete a.docs
  }

  return a
}

export const camelCaseToWords = (str) => {
  return str
    .match(/^[a-z]+|[A-Z][a-z]*/g)
    .map(function (x) {
      return x[0].toUpperCase() + x.substr(1).toLowerCase()
    })
    .join(" ")
}
