import { Address } from "viem"

export const knownAddressNames: { [key: Address]: string } = {
  "0xAaaAAAaa00000464000000000000000000000000": "TNL Bridged Collection",
  "0xAaAaAAaa00003064000000000000000000000000": "FLUF Bridged Collection",
  "0xAAaaAAAA00008464000000000000000000000000": "Seekers Bridged Collection",
  "0xAAAaaAAA00006C64000000000000000000000000": "Party Bear Bridged Collection",
}

export const contractAddressToNativeId = (
  contractAddress: Address
): string | null => {
  const startPrefix = contractAddress?.substring(0, 10)
  const allowed = ["0xaaaaaaaa", "0xcccccccc", "0xbbbbbbbb"]
  if (!allowed?.includes(startPrefix?.toLowerCase())) {
    return null
  }
  return parseInt(
    contractAddress?.substring(10, contractAddress?.length - 24),
    16
  ).toString(16)
}

export const getAddressName = (
  address: Address,
  useShortenedAddress = false
) => {
  const nativeId = contractAddressToNativeId(address)
  const shortenedAddress = nativeId
    ? address?.substring(0, 4) +
      `..${nativeId}..` +
      address?.substring(address?.length - 4, address?.length)
    : address?.substring(0, 5) +
      "..." +
      address?.substring(address?.length - 4, address?.length)

  return knownAddressNames[address] || (useShortenedAddress ? shortenedAddress : address)
}

export const getShortenedHash = (address: string) => {
  return (
    address?.substring(0, 5) +
    "..." +
    address?.substring(address?.length - 4, address?.length)
  )
}
