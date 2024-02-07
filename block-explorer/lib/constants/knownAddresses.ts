import { Address } from "viem"

let knownAddressNames: { [key: Address]: string } = {}

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
