import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import SectionTitle from '@/components/section-title';
import TestnetWarning from '@/components/testnet-warning';

export async function generateMetadata({ params }) {
  return {
    title: `Event ${params.eventId}`,
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  const { eventId } = params;

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
