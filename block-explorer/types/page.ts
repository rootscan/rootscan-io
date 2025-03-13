export interface PageProps {
  params: Promise<{
    address?: string;
    blocknumber?: number;
    extrinsicId?: string;
    eventId?: string;
    id?: string;
    contractaddress?: string;
  }>;
  searchParams?: Promise<{
    page?: string;
    type?: string;
  }>;
}
