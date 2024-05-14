import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import Menu from './components/menu';

export async function generateMetadata({ params }) {
  return {
    title: `Block #${params.blocknumber}`,
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  const { blocknumber } = params;

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Block #{blocknumber}</SectionTitle>
        <TestnetWarning>
          <p className="text-sm text-red-500">
            [ This is a <strong>Testnet</strong> block only ]
          </p>
        </TestnetWarning>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Menu />
          <div className="flex items-center gap-1">
            <Link href={`/blocks/${Number(blocknumber) - 1}`}>
              <Button size="icon" variant="outline">
                <ChevronLeft />
              </Button>
            </Link>
            <Link href={`/blocks/${Number(blocknumber) + 1}`}>
              <Button size="icon" variant="outline">
                <ChevronRight />
              </Button>
            </Link>
          </div>
        </div>
        {children}
      </div>
    </Container>
  );
}
