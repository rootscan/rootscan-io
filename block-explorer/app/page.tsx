import { ArrowLeftRight, Clock, Pencil, Wallet } from "lucide-react"

import Container from "@/components/container"
import LatestBlocks from "@/components/homepage/latest-blocks"
import LatestExtrinsics from "@/components/homepage/latest-extrinsics"
import LatestTransactions from "@/components/homepage/latest-transactions"
import TargetTimeCountdown from "@/components/target-time-countdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getBlocks,
  getChainSummary,
  getExtrinsics,
  getTransactions,
} from "@/lib/api"

const getData = async () => {
  const [
    latestBlocksBase,
    latestTransactionsBase,
    latestExtrinsicsBase,
    chainSummary,
  ] = await Promise.all([
    getBlocks({ page: 1, limit: 5 }),
    getTransactions({
      page: 1,
      limit: 5,
    }),
    getExtrinsics({
      page: 1,
      limit: 5,
    }),
    getChainSummary({}),
  ])

  return {
    latestExtrinsics: latestExtrinsicsBase?.docs || [],
    latestBlocks: latestBlocksBase?.docs || [],
    latestTransactions: latestTransactionsBase?.docs || [],
    chainSummary,
  }
}

export default async function IndexPage() {
  const { latestBlocks, latestExtrinsics, latestTransactions, chainSummary } =
    await getData()

  return (
    <Container>
      <div className="flex flex-col gap-6">
        {/* <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This Block Explorer is currently under development.
          </AlertDescription>
        </Alert> */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Target Block Time", value: "4s", icon: Clock },
            {
              title: "Signed Extrinsics",
              value: chainSummary?.signedExtrinsics,
              icon: Pencil,
            },
            {
              title: "Total Transactions",
              value: chainSummary?.evmTransactions,
              icon: ArrowLeftRight,
            },
            {
              title: "Wallet Addresses",
              value: chainSummary?.addresses,
              icon: Wallet,
            },
          ].map((stat, _) => {
            const Icon = stat.icon
            return (
              <Card key={_}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <Icon className="size-5 text-muted-foreground" />
                  <CardTitle className="text-xs uppercase text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat?.title === "Target Block Time" ? (
                      <TargetTimeCountdown />
                    ) : (
                      stat.value
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-full lg:col-span-3">
            <LatestBlocks latestBlocks={latestBlocks} />
          </div>
          <div className="col-span-full lg:col-span-6">
            <LatestTransactions latestTransactions={latestTransactions} />
          </div>
          <div className="col-span-full lg:col-span-3">
            <LatestExtrinsics latestExtrinsics={latestExtrinsics} />
          </div>
        </section>
      </div>
    </Container>
  )
}
