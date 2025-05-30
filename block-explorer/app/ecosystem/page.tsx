import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const resources = {
  'The Root Network': [
    {
      title: 'The Root Network',
      description:
        'More than just a blockchain, The Root Network enables seamless user experience and asset interoperability across the open metaverse.',
      logo: '/ecosystem-logos/trn-logo.jpg',
      url: 'https://www.therootnetwork.com/',
      category: 'Protocol',
    },
    {
      title: 'Portal',
      description: 'A dashboard that aids in creating extrinsics and reading blockchain data.',
      logo: '/ecosystem-logos/root-portal.png',
      url: 'https://portal.rootnet.live/',
      category: 'Tooling',
    },
    {
      title: 'Bridge',
      description: 'Cross-chain bridge by The Root Network allowing users to seamlessly bridge assets.',
      logo: '/ecosystem-logos/root-bridge.png',
      url: 'https://app.rootnet.live/bridge',
      category: 'Tooling',
    },
    {
      title: 'Documentation',
      description: 'All documentation involving The Root Network.',
      logo: '/ecosystem-logos/root-docs.png',
      url: 'https://docs.therootnetwork.com/',
      category: 'Docs',
    },
    {
      title: 'Futurepass',
      description: 'Your passport through the open metaverse.',
      logo: '/ecosystem-logos/fp-logo.png',
      url: 'https://www.futureverse.com/futurepass',
      category: 'Wallet',
    },
    {
      title: 'TRN Evm SDK',
      description: 'A utility package that simplifies EVM development on The Root Network.',
      logo: '/ecosystem-logos/root-evm.png',
      url: 'https://www.npmjs.com/package/@therootnetwork/evm',
      category: 'Tooling',
    },
    {
      title: 'TRN Native SDK',
      description:
        'A utility package that complements the @polkadot/api to connect and interact with the Root Network node.',
      logo: '/ecosystem-logos/root-native.png',
      url: 'https://www.npmjs.com/package/@therootnetwork/api',
      category: 'Tooling',
    },
  ],
  'Projects utilizing TRN': [
    {
      title: 'Moai Finance',
      description: 'Multi-chain DEX & Cross-chain DEX aggregator.',
      logo: '/ecosystem-logos/moai-logo.png',
      url: 'https://app.moai-finance.xyz/',
      category: 'DEX',
    },
    {
      title: 'Dexter',
      description: 'Swap tokens, or provide liquidity to pools and earn fees on swaps.',
      logo: '/ecosystem-logos/dexter-logo.jpeg',
      url: 'https://app.dexter.trade/',
      category: 'DEX',
    },
    {
      title: 'Tradeverse',
      description: 'An NFT marketplace to trade The Root Network collectibles.',
      logo: '/ecosystem-logos/tradeverse-logo.png',
      url: 'https://thetradeverse.xyz/',
      category: 'NFT Marketplace',
    },
    {
      title: 'FIFA World Cup: AI League',
      description:
        'Join the AI League, challenge your friends, and become an icon in a new era of football manager games.',
      logo: '/ecosystem-logos/fifa-logo.png',
      url: 'https://fifaworldcupaileague.com/',
      category: 'Gaming',
    },
    {
      title: 'AIFA',
      description:
        'AIFA is a decentralised Play-and-Earn game economy, built by Altered State Machine to unleash the power of Non-Fungible Intelligence.',
      logo: '/ecosystem-logos/aifa-logo.png',
      url: 'https://aifa.football/',
      category: 'Gaming',
    },
    {
      title: 'The Next Legends',
      description: 'Follow in the footsteps of Muhammad Ali as you train your AI boxer and lead them to glory.',
      logo: '/ecosystem-logos/tnl-logo.png',
      url: 'https://www.thenextlegends.xyz/',
      category: 'Gaming',
    },
    {
      title: 'Goblins',
      description: 'Dive fist-first into a stream-to-play battlesimulator where chaos reigns supreme',
      logo: '/ecosystem-logos/goblins-logo.jpeg',
      url: 'https://godsandgoblins.com/',
      category: 'Gaming',
    },
    {
      title: 'Paddi',
      description:
        'Introducing Paddi, a futuristic take on a nostalgic arcade game where you can train an AI Agent to compete in your place. This is a demo driven by a protocol for ownable, trainable and tradable decentralized Artificial Intelligence.',
      logo: '/ecosystem-logos/paddi-logo.png',
      url: 'https://paddi.alteredstatemachine.xyz/',
      category: 'AI Porcini Only',
    },
    {
      title: 'Raicers',
      description: 'Unlock a Kart, recruit a Driver, and equip a Brain to activate your Raicer.',
      logo: '/ecosystem-logos/raicers-logo.png',
      url: 'https://www.raicers.com/',
      category: 'Gaming',
    },
  ],
};

export default function Page() {
  return (
    <Container className="flex flex-col gap-4">
      <Breadcrumbs />
      <div className="space-y-16">
        {Object.keys(resources)?.map((section, _) => (
          <div key={_} className="space-y-6">
            <SectionTitle>{section}</SectionTitle>
            <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {resources[section].map((item, _) => (
                <Link href={item?.url} key={`${section}_${_}`} target="_blank">
                  <div className="flex h-full flex-col justify-between space-y-3 rounded-lg border bg-muted p-3">
                    <Image
                      src={item?.logo}
                      width={500}
                      height={500}
                      unoptimized
                      priority
                      alt="logo"
                      className="aspect-square w-full rounded-lg"
                    />
                    <h3 className="shrink">{item?.title}</h3>
                    <p className="grow text-xs text-muted-foreground">{item?.description}</p>
                    <div>
                      <Badge type="linear">{item?.category}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          </div>
        ))}
      </div>
    </Container>
  );
}
