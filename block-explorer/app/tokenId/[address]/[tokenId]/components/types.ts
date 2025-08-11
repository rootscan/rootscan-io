export interface PageProps {
  params: Promise<{
    address: string;
    tokenId: number;
  }>;
  searchParams?: Promise<{
    page?: string;
    type?: string;
  }>;
}
