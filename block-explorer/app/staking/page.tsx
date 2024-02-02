import AddressDisplay from "@/components/address-display"
import Breadcrumbs from "@/components/breadcrumbs"
import Container from "@/components/container"
import Pagination from "@/components/pagination"
import SectionTitle from "@/components/section-title"
import TokenDisplay from "@/components/token-display"
import Tooltip from "@/components/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getStakingValidators } from "@/lib/api"
import { ROOT_TOKEN } from "@/lib/constants/tokens"
import { getPaginationData } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import { Fragment, Suspense } from "react"

const getData = async ({ searchParams, params }) => {
  let data = await getStakingValidators({ page: searchParams?.page || 1 })

  return data
}
export default async function Page({ searchParams, params }) {
  const data = await getData({ searchParams, params })
  const contracts = data?.docs
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Staking Validators</SectionTitle>
        <p className="text-xs">
          If you own $ROOT and wish to stake, please visit here.
        </p>
        <Suspense fallback={<Fragment />}>
          <Pagination pagination={getPaginationData(data)} />
        </Suspense>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Validator</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nominators</TableHead>
              <TableHead>Total Root Nominated</TableHead>
              <TableHead className="text-center">
                Validated Blocks (24h)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts?.map((item, _) => (
              <TableRow key={_}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AddressDisplay
                      address={item.validator}
                      useShortenedAddress
                    />
                    {item?.isOversubscribed ? (
                      <Tooltip
                        text={`Validators can only pay out the first 256 nominators per era. \n You will not earn rewards if you are 257 or higher nominator.`}
                      >
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                      </Tooltip>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{item?.validatorName}</TableCell>
                <TableCell>{item.nominators}</TableCell>
                <TableCell>
                  <TokenDisplay
                    token={ROOT_TOKEN}
                    amount={item?.totalRootNominated}
                    hideCopyButton
                  />
                </TableCell>
                <TableCell className="text-center">
                  {item?.blocksValidated || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  )
}
