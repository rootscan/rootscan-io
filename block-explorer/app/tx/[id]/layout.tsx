import { ReactNode } from 'react';

import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning.tsx';

import Menu from './components/menu';

export async function generateMetadata({ params }) {
  return {
    title: `EVM Transaction ${params.id}`,
  };
}

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <Container className="flex flex-col gap-6">
      <div className="space-y-4">
        <Breadcrumbs />
        <SectionTitle>EVM Transaction</SectionTitle>
        <TestnetWarning>
          <p className="text-sm text-red-500">
            [This is a <strong>Testnet</strong> transaction only]
          </p>
        </TestnetWarning>
      </div>
      <div className="space-y-4">
        <Menu />
        {children}
      </div>
    </Container>
  );
}
