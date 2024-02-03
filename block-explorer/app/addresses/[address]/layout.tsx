import AddressDisplay from "@/components/address-display"
import Breadcrumbs from "@/components/breadcrumbs"
import Container from "@/components/container"
import TokenDisplay from "@/components/token-display"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CardDetail from "@/components/ui/card-detail"
import { getAddress } from "@/lib/api"
import { ROOT_TOKEN } from "@/lib/constants/tokens"
import { formatNumberDollars } from "@/lib/utils"
import { generateAvatarURL } from "@cfx-kit/wallet-avatar"
import Image from "next/image"
import { getAddress as getAddressViem } from "viem"
import Menu from "./components/menu"

const getData = async ({ params }) => {
  const data = await getAddress({ address: getAddressViem(params.address) })
  return data
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  const { address } = params
  const data = await getData({ params })
  const tags: string[] = []
  if (getAddressViem(address)?.toLowerCase()?.startsWith("0xffffffff")) {
    tags.push("Futurepass")
  }
  if (getAddressViem(address)?.toLowerCase()?.startsWith("0xaaaaaaaa")) {
    tags.push("ERC721 Precompile")
  }
  if (getAddressViem(address)?.toLowerCase()?.startsWith("0xcccccccc")) {
    tags.push("ERC20 Precompile")
  }
  if (getAddressViem(address)?.toLowerCase()?.startsWith("0xbbbbbbbb")) {
    tags.push("ERC1155 Precompile")
  }
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <div className="size-8">
                  <Image
                    src={generateAvatarURL(address)}
                    width={50}
                    height={50}
                    priority
                    unoptimized
                    className="rounded-[5px]"
                    alt="jazz"
                  />
                </div>
                {data?.isContract ? "EVM Smart Contract" : "Overview"}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {data?.nameTag ? (
                <CardDetail.Wrapper>
                  <CardDetail.Title>Name Tag</CardDetail.Title>
                  <CardDetail.Content>{data?.nameTag}</CardDetail.Content>
                </CardDetail.Wrapper>
              ) : null}
              <CardDetail.Wrapper>
                <CardDetail.Title>Address</CardDetail.Title>
                <CardDetail.Content>
                  <AddressDisplay address={address} className="truncate" />
                </CardDetail.Content>
              </CardDetail.Wrapper>
              <CardDetail.Wrapper>
                <CardDetail.Title>Root Balance</CardDetail.Title>
                <CardDetail.Content>
                  {!data?.balance?.reserved &&
                  data?.balance?.reserved !== "0" ? (
                    <div className="flex flex-col gap-2">
                      <TokenDisplay
                        token={ROOT_TOKEN}
                        amount={data?.balance?.free || 0}
                        hideCopyButton
                      />
                      {data?.balance?.freeFormatted &&
                      data?.rootPriceData?.price ? (
                        <span className="text-xs text-muted-foreground">
                          {formatNumberDollars(
                            Number(data?.balance?.freeFormatted) *
                              data.rootPriceData.price,
                            2
                          )}{" "}
                          @ ({formatNumberDollars(data.rootPriceData.price)}/
                          Root)
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Free</span>
                      <span>
                        {data?.balance?.freeFormatted
                          ? data?.balance?.freeFormatted
                          : "0"}{" "}
                      </span>
                      <span className="text-muted-foreground">Reserved</span>
                      <span>
                        {data?.balance?.reservedFormatted
                          ? data?.balance?.reservedFormatted
                          : "0"}
                      </span>
                    </div>
                  )}
                </CardDetail.Content>
              </CardDetail.Wrapper>

              {tags?.length ? (
                <CardDetail.Wrapper>
                  <CardDetail.Title>Tags</CardDetail.Title>
                  <CardDetail.Content>
                    <div className="mt-2 flex gap-2">
                      {tags?.map((tag, _) => (
                        <Badge variant="default" key={_}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardDetail.Content>
                </CardDetail.Wrapper>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between gap-4">
          <Menu
            isContract={data?.isContract}
            isVerified={data?.isVerifiedContract || false}
          />
        </div>
        {children}
      </div>
    </Container>
  )
}
