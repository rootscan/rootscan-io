import AddressDisplay from '@/components/address-display';
import { CopyButton } from '@/components/copy-button';
import { getEventComponent } from '@/components/events-components';
import JsonViewer from '@/components/json-viewer';
import Timestamp from '@/components/timestamp';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { getEvent } from '@/lib/api';
import { camelCaseToWords } from '@/lib/utils';
import Link from 'next/link';

const getData = async ({ params }) => {
  const data = await getEvent({ eventId: String(params?.eventId) });

  return data;
};

export default async function Page({ params }) {
  const data = await getData({ params });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <CardDetail.Wrapper>
            <CardDetail.Title>Event ID</CardDetail.Title>
            <CardDetail.Content>{data?.eventId}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsic ID</CardDetail.Title>
            <CardDetail.Content>
              {data?.extrinsicId ? (
                <Link href={`/extrinsics/${data.extrinsicId}`}>
                  <span className="truncate">{data.extrinsicId}</span>
                </Link>
              ) : (
                '-'
              )}
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Timestamp</CardDetail.Title>
            <CardDetail.Content>
              <Timestamp date={data?.timestamp * 1000} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Section</CardDetail.Title>
            <CardDetail.Content>
              <div>
                <Badge>{data?.section}</Badge>
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Method</CardDetail.Title>
            <CardDetail.Content>
              <div>
                <Badge>{data?.method ? camelCaseToWords(data.method) : null}</Badge>
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">⚡ Event(s)</span>
            <div className="mt-1 rounded-2xl bg-black/5 p-3 dark:bg-white/5">{getEventComponent(data)}</div>
          </div>
          <CardDetail.Wrapper>
            <CardDetail.Title>Raw Arguments</CardDetail.Title>
            <CardDetail.Content>{data?.args ? <JsonViewer json={data?.args} /> : null}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Hash</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex items-center gap-2">
                <span className="truncate">{data?.hash}</span>
                <CopyButton value={data?.hash} />
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Description</CardDetail.Title>
            <CardDetail.Content>{data?.doc ? data?.doc : '-'}</CardDetail.Content>
          </CardDetail.Wrapper>
          {data?.signer ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>Signer</CardDetail.Title>
              <CardDetail.Content>
                <AddressDisplay address={data?.signer} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
