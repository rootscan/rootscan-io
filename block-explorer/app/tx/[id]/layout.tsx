import { ReactNode } from 'react';

import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';

import Menu from './components/menu';

export async function generateMetadata({ params }) {
  return {
    title: `EVM Transaction ${params.id}`,
  };
}

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>EVM Transaction</SectionTitle>
        <Menu />
        {children}
      </div>
    </Container>
  );
}
