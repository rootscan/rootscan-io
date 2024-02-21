const BASE_URL = process.env.BASE_URL

const fetcher = async ({
  url,
  body,
  method = "POST",
  noBaseUrl = false,
  cacheDuration,
}: {
  url: string
  body?: any
  method?: string
  noBaseUrl?: boolean
  cacheDuration?: number
}) => {
  const useUrl = noBaseUrl ? url : `${BASE_URL}${url}`
  const cache: any = cacheDuration
    ? { next: { revalidate: cacheDuration } }
    : { cache: "no-store" }

  return fetch(useUrl, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...cache,
    body,
  }).then((resp: Response) => {
    if (resp.ok) {
      return resp.json()
    } else {
      return resp.text().then((text: any) => {
        console.log("Error: ", text)
        let message = ""
        try {
          const err = JSON.parse(text)
          message = err.message
        } catch (a) {}
        throw new Error(message || text)
      })
    }
  })
}

export const getBlock = (body: any) => {
  return fetcher({
    url: "/getBlock",
    body: JSON.stringify(body),
  })
}

export const getBlocks = (body: any) => {
  return fetcher({
    url: "/getBlocks",
    body: JSON.stringify(body),
  })
}

export const getExtrinsicsInBlock = (body: any) => {
  return fetcher({
    url: "/getExtrinsicsInBlock",
    body: JSON.stringify(body),
  })
}

export const getToken = (body: any) => {
  return fetcher({
    url: "/getToken",
    body: JSON.stringify(body),
  })
}

export const getTokenHolders = (body: any) => {
  return fetcher({
    url: "/getTokenHolders",
    body: JSON.stringify(body),
  })
}

export const generateReport = (body: any) => {
  return fetcher({
    url: "/generateReport",
    body: JSON.stringify(body),
  })
}

export const getNft = (body: any) => {
  return fetcher({
    url: "/getNft",
    body: JSON.stringify(body),
    cacheDuration: 60 * 120,
  })
}
export const getFuturepasses = (body: any) => {
  return fetcher({
    url: "/getFuturepasses",
    body: JSON.stringify(body),
  })
}

export const getTransactions = (body: any) => {
  return fetcher({
    url: "/getTransactions",
    body: JSON.stringify(body),
  })
}

export const getTokens = (body: any) => {
  return fetcher({
    url: "/getTokens",
    body: JSON.stringify(body),
  })
}
export const getChainSummary = (body: any) => {
  return fetcher({
    url: "/getChainSummary",
    body: JSON.stringify(body),
    cacheDuration: 60 * 15,
  })
}

export const getEVMTransactionsForWallet = (body: any) => {
  return fetcher({
    url: "/getEVMTransactionsForWallet",
    body: JSON.stringify(body),
  })
}

export const getTokenTransfersFromAddress = (body: any) => {
  return fetcher({
    url: "/getTokenTransfersFromAddress",
    body: JSON.stringify(body),
  })
}

export const getNftsForAddress = (body: any) => {
  return fetcher({
    url: "/getNftsForAddress",
    body: JSON.stringify(body),
  })
}

export const getNftCollectionsForAddress = (body: any) => {
  return fetcher({
    url: "/getNftCollectionsForAddress",
    body: JSON.stringify(body),
  })
}

export const getRootPrice = (body: any) => {
  return fetcher({
    url: "/getRootPrice",
    body: JSON.stringify(body),
    cacheDuration: 60 * 30,
  })
}

export const getTokenBalances = (body: any) => {
  return fetcher({
    url: "/getTokenBalances",
    body: JSON.stringify(body),
  })
}

export const getTransaction = (body: any) => {
  return fetcher({
    url: "/getTransaction",
    body: JSON.stringify(body),
  })
}

export const getAddresses = (body: any) => {
  return fetcher({
    url: "/getAddresses",
    body: JSON.stringify(body),
  })
}

export const getAddress = (body: any) => {
  return fetcher({
    url: "/getAddress",
    body: JSON.stringify(body),
  })
}

export const getExtrinsic = (body: any) => {
  return fetcher({
    url: "/getExtrinsic",
    body: JSON.stringify(body),
  })
}

export const getExtrinsics = (body: any) => {
  return fetcher({
    url: "/getExtrinsics",
    body: JSON.stringify(body),
  })
}

export const getTransactionsInBlock = (body: any) => {
  return fetcher({
    url: "/getTransactionsInBlock",
    body: JSON.stringify(body),
  })
}

export const getEvents = (body: any) => {
  return fetcher({
    url: "/getEvents",
    body: JSON.stringify(body),
  })
}

export const getEvent = (body: any) => {
  return fetcher({
    url: "/getEvent",
    body: JSON.stringify(body),
  })
}

export const getBridgeTransactions = (body: any) => {
  return fetcher({
    url: "/getBridgeTransactions",
    body: JSON.stringify(body),
  })
}

export const getStakingValidators = (body: any) => {
  return fetcher({
    url: "/getStakingValidators",
    body: JSON.stringify(body),
  })
}

export const getVerifiedContracts = (body: any) => {
  return fetcher({
    url: "/getVerifiedContracts",
    body: JSON.stringify(body),
  })
}

export const getNativeTransfersForAddress = (body: any) => {
  return fetcher({
    url: "/getNativeTransfersForAddress",
    body: JSON.stringify(body),
  })
}

export const getExtrinsicsForAddress = (body: any) => {
  return fetcher({
    url: "/getExtrinsicsForAddress",
    body: JSON.stringify(body),
  })
}

export const getDex = (body: any) => {
  return fetcher({
    url: "/getDex",
    body: JSON.stringify(body),
  })
}

export const getContractVerification = ({ contractAddress }) => {
  const CHAIN_ID = process?.env?.CHAIN_ID
  return fetcher({
    method: "GET",
    url: `https://sourcify.dev/server/files/${CHAIN_ID}/${contractAddress}`,
    noBaseUrl: true,
  })
}
