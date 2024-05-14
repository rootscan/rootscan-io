import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning';

import Menu from './components/menu';

export async function generateMetadata({ params }) {
  return {
    title: `Extrinsic ${params.extrinsicId}`,
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  const { extrinsicId } = params;

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <Menu />
        <SectionTitle>Extrinsic {extrinsicId}</SectionTitle>
        <TestnetWarning>
          <p className="text-sm text-red-500">
            [ This is a <strong>Testnet</strong> extrinsic only ]
          </p>
        </TestnetWarning>
        {children}
      </div>
    </Container>
  );
}
