import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning';

import Menu from './components/menu';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ extrinsicId: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ extrinsicId: string }> }) {
  const paramsObj = await params;
  return {
    title: `Extrinsic ${paramsObj.extrinsicId}`,
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { extrinsicId } = await params;

  return (
    <Container className="flex flex-col gap-6">
      <div className="space-y-4">
        <Breadcrumbs />
        <SectionTitle>Extrinsic {extrinsicId}</SectionTitle>
      </div>

      <div className="space-y-4">
        <Menu />
        <TestnetWarning>
          <p className="text-sm text-red-500">
            [This is a <strong>Testnet</strong> extrinsic only]
          </p>
        </TestnetWarning>
        {children}
      </div>
    </Container>
  );
}
