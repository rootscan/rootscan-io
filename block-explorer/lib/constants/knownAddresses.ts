import { Address } from "viem"

let knownAddressNames: { [key: Address]: string } = {}

export const getAddressName = (
  address: Address,
  useShortenedAddress = false
) => {
  const shortenedAddress =
    address?.substring(0, 5) +
    "..." +
    address?.substring(address?.length - 4, address?.length)

  return knownAddressNames[address]
    ? knownAddressNames[address]
    : useShortenedAddress
      ? shortenedAddress
      : address
}

export const getShortenedHash = (address: string) => {
  return (
    address?.substring(0, 5) +
    "..." +
    address?.substring(address?.length - 4, address?.length)
  )
}
