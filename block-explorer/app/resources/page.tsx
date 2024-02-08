import Breadcrumbs from "@/components/breadcrumbs"
import Container from "@/components/container"
import SectionTitle from "@/components/section-title"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"

const resources = {
  "The Root Network": [
    {
      title: "The Root Network",
      description:
        "More than just a blockchain, The Root Network enables seamless user experience and asset interoperability across the open metaverse.",
      logo: "/resources-logos/trn-logo.jpg",
      url: "https://www.therootnetwork.com/",
      category: "Protocol",
    },
    {
      title: "Portal",
      description:
        "A dashboard that aids in creating extrinsics and reading blockchain data.",
      logo: "/resources-logos/trn-logo.jpg",
      url: "https://portal.rootnet.live/",
      category: "Tooling",
    },
    {
      title: "Bridge",
      description:
        "Cross-chain bridge by The Root Network allowing users to seamlessly bridge assets.",
      logo: "/resources-logos/trn-logo.jpg",
      url: "https://www.therootnetwork.com/",
      category: "Tooling",
    },
    {
      title: "Documentation",
      description: "All documentation involving The Root Network.",
      logo: "/resources-logos/trn-logo.jpg",
      url: "https://docs.therootnetwork.com/",
      category: "Docs",
    },
  ],
  "Projects utilizing TRN": [
    {
      title: "Moai Finance",
      description: "Multi-chain DEX & Cross-chain DEX aggregator.",
      logo: "/resources-logos/moai-logo.png",
      url: "https://app.moai-finance.xyz/",
      category: "DEX",
    },
    {
      title: "Dexter",
      description:
        "Swap tokens, or provide liquidity to pools and earn fees on swaps.",
      logo: "/resources-logos/dexter-logo.jpeg",
      url: "https://app.dexter.trade/",
      category: "DEX",
    },
    {
      title: "MARK",
      description: "A NFT marketplace built on top of The Root Network.",
      logo: "/resources-logos/mark-logo.png",
      url: "https://mark.halolab.io/",
      category: "NFT Marketplace",
    },
    {
      title: "FIFA World Cup: AI League",
      description:
        "Join the AI League, challenge your friends, and become an icon in a new era of football manager games.",
      logo: "/resources-logos/fifa-logo.png",
      url: "https://fifaworldcupaileague.com/",
      category: "Gaming",
    },
    {
      title: "AIFA",
      description:
        "AIFA is a decentralised Play-and-Earn game economy, built by Altered State Machine to unleash the power of Non-Fungible Intelligence.",
      logo: "/resources-logos/aifa-logo.png",
      url: "https://aifa.football/",
      category: "Gaming",
    },
    {
      title: "The Next Legends",
      description:
        "Follow in the footsteps of Muhammad Ali as you train your AI boxer and lead them to glory.",
      logo: "/resources-logos/tnl-logo.png",
      url: "https://www.thenextlegends.xyz/",
      category: "Gaming",
    },
  ],
}

export default function Page() {
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <Breadcrumbs />
        {Object.keys(resources)?.map((section, _) => (
          <Fragment key={_}>
            <SectionTitle>{section}</SectionTitle>
            <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {resources[section].map((item, _) => (
                <Link href={item?.url} key={`${section}_${_}`} target="_blank">
                  <div className="flex h-full flex-col justify-between space-y-3 rounded-lg border bg-muted p-3">
                    <Image
                      src={item?.logo}
                      width={500}
                      height={500}
                      alt="logo"
                      className="aspect-square w-full rounded-lg"
                    />
                    <h3 className="shrink">{item?.title}</h3>
                    <p className="grow text-xs text-muted-foreground">
                      {item?.description}
                    </p>
                    <div>
                      <Badge variant="outline">{item?.category}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          </Fragment>
        ))}
      </div>
    </Container>
  )
}
