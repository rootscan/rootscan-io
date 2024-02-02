import { getContractVerification } from "@/lib/api"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import WalletProvider from "./components/wallet-provider"
import WriteContract from "./components/write-contract"

const getData = async ({ params }) => {
  const fetchData = await getContractVerification({
    contractAddress: params.address,
  }).catch((e) => {
    return null
  })

  if (!fetchData) {
    return null
  }

  let parsedData: { metadata?: any; files: any[] } = {
    metadata: undefined,
    files: [],
  }
  if (fetchData && !fetchData?.error) {
    for (const file of fetchData) {
      if (file?.name === "metadata.json") {
        if (file?.content) {
          file.content = JSON.parse(file.content)
        }
        parsedData["metadata"] = file
      } else {
        parsedData["files"].push(file)
      }
    }
  }
  return parsedData
}

export default async function Page({ params }: { params: any }) {
  const data = await getData({ params })

  return (
    <WalletProvider>
      <div className="flex flex-col gap-4">
        <ConnectButton />
        <WriteContract data={data} address={params.address} />
      </div>
    </WalletProvider>
  )
}
