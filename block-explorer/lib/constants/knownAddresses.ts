import { Address } from "viem"

let knownAddressNames: { [key: Address]: string } = {
  "0x04e9F2dbd715C439D80A9B6E0b5B1F0D570e395f": "Batek",
}

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
