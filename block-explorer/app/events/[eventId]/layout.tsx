import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }) {
  const paramsObj = await params;
  return {
    title: `Event ${paramsObj.eventId}`,
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { eventId } = await params;

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Event {eventId}</SectionTitle>
        <TestnetWarning>
          <p className="text-sm text-red-500">
            [ This is a <strong>Testnet</strong> event only ]
          </p>
        </TestnetWarning>
        {children}
      </div>
    </Container>
  );
}
