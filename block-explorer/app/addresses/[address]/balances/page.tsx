import NoData from "@/components/no-data"
import PaginationSuspense from "@/components/pagination-suspense"
import TokenDisplay from "@/components/token-display"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTokenBalances } from "@/lib/api"
import { getPaginationData } from "@/lib/utils"

const getData = async ({ params, searchParams }: any) => {
  const data = await getTokenBalances({
    address: params.address,
    page: searchParams?.page,
  })

  return data
}

export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams })
  const balances = data?.docs

  return (
    <div className="flex flex-col gap-6">
      <PaginationSuspense pagination={getPaginationData(data)} />

      {balances?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {balances?.map((token, _) => (
                <div className="flex flex-row items-center gap-4 py-4" key={_}>
                  <TokenDisplay
                    token={token?.tokenDetails}
                    amount={token?.balance}
                    hideCopyButton
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <NoData />
      )}
    </div>
  )
}
