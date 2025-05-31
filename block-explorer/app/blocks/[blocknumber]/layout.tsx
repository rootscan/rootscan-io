import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning';

import Menu from './components/menu';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ blocknumber: number }>;
}

export async function generateMetadata({ params }: { params: Promise<{ blocknumber: number }> }) {
  const paramsObj = await params;
  return {
    title: `Block #${paramsObj.blocknumber}`,
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { blocknumber } = await params;

  return (
    <Container className="flex flex-col gap-6">
      <div className="space-y-4">
        <Breadcrumbs />
        <SectionTitle>Block #{blocknumber}</SectionTitle>
      </div>

      <div className="space-y-4">
        <TestnetWarning>
          <p className="text-sm text-red-500">
            [This is a <strong>Testnet</strong> block only]
          </p>
        </TestnetWarning>
        <Menu />
        {children}
      </div>
    </Container>
  );
}
