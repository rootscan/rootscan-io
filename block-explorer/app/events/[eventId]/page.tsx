import AddressDisplay from '@/components/address-display';
import { CopyButton } from '@/components/copy-button';
import { ErrorAlert } from '@/components/error-alert';
import { getEventComponent } from '@/components/events-components';
import JsonViewer from '@/components/json-viewer';
import NoData from '@/components/no-data';
import Timestamp from '@/components/timestamp';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { Separator } from '@/components/ui/separator.tsx';
import { ApiCommand, request } from '@/lib/api';
import { camelCaseToWords, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import Link from 'next/link';

export default async function Page({ params }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.eventId) {
      throw new Error('Event ID is required');
    }

    const data = handleRequestResult(await request(ApiCommand.getEvent, { eventId: paramsObj.eventId }));

    if (!data) return <NoData />;

    return (
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <CardDetail.Wrapper>
            <CardDetail.Title>Event ID</CardDetail.Title>
            <CardDetail.Content>{data.eventId}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsic ID</CardDetail.Title>
            <CardDetail.Content>
              {data.extrinsicId ? (
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
              <Timestamp date={data.timestamp * 1000} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Section</CardDetail.Title>
            <CardDetail.Content>
              <div>
                <Badge>{data.section}</Badge>
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Method</CardDetail.Title>
            <CardDetail.Content>
              <div>
                <Badge>{data.method ? camelCaseToWords(data.method) : null}</Badge>
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>Event(s)</CardDetail.Title>
            <CardDetail.Content>
              <div className="mt-1 rounded-2xl bg-black/5 p-3 dark:bg-white/5">{getEventComponent(data)}</div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>
              <div className="flex items-center gap-2">
                Raw Arguments
                <CopyButton value={JSON.stringify(data.args, null, 2)} />
              </div>
            </CardDetail.Title>
            <CardDetail.Content className="w-full">
              {data.args ? <JsonViewer json={data.args} className="w-full" /> : null}
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>Hash</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex items-center gap-2">
                <span className="truncate">{data.hash}</span>
                <CopyButton value={data.hash} />
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>Description</CardDetail.Title>
            <CardDetail.Content>{data.doc ? data.doc : '-'}</CardDetail.Content>
          </CardDetail.Wrapper>
          {data.signer ? (
            <>
              <Separator />
              <CardDetail.Wrapper>
                <CardDetail.Title>Signer</CardDetail.Title>
                <CardDetail.Content>
                  <AddressDisplay address={data.signer} />
                </CardDetail.Content>
              </CardDetail.Wrapper>
            </>
          ) : null}
        </CardContent>
      </Card>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
