import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import SectionTitle from '@/components/section-title';

export default async function Page() {
  try {
    return (
      <Container className="flex flex-col gap-6">
        <div className="space-y-4">
          <Breadcrumbs />
          <SectionTitle>Nft token info</SectionTitle>
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
