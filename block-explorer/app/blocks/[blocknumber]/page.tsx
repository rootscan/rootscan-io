import { CopyButton } from '@/components/copy-button';
import NoData from '@/components/no-data';
import Timestamp from '@/components/timestamp';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { getBlock } from '@/lib/api';
import Link from 'next/link';

export default async function Page({ params }: { params: any }) {
  const { blocknumber } = params;
  if (Number(blocknumber) < 0) {
    throw new Error('There is no block lower than 0.');
  }
  const block = await getBlock({ number: blocknumber });

  if (!block) return <NoData />;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Overview</CardTitle>
        <div className="absolute right-6 top-6 text-xs">
          {block?.isFinalized ? (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-300" />
              Finalized
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-orange-300" />
              Unfinalized
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <CardDetail.Wrapper>
            <CardDetail.Title>Height</CardDetail.Title>
            <CardDetail.Content>{block.number}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Timestamp</CardDetail.Title>
            <CardDetail.Content>
              <Timestamp date={block?.timestamp} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Status</CardDetail.Title>
            <CardDetail.Content>
              {block?.isFinalized ? (
                <div>
                  <Badge variant="success">Finalized</Badge>
                </div>
              ) : (
                <div>
                  <Badge variant="warning">Unfinalized</Badge>
                </div>
              )}
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Hash</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex items-center gap-2">
                <span className="truncate">{block.hash}</span>
                <CopyButton value={block.hash} />
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Parent Hash</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex items-center gap-2">
                <Link href={`/blocks/${block.number - 1}`} className="truncate">
                  <span>{block.parentHash}</span>
                </Link>
                <CopyButton value={block?.parentHash} />
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>State Root</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex items-center gap-2">
                <span className="truncate">{block.stateRoot}</span>
                <CopyButton value={block.stateRoot} />
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsics Root</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex items-center gap-2">
                <span className="truncate">{block.extrinsicsRoot}</span>
                <CopyButton value={block.extrinsicsRoot} />
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsics</CardDetail.Title>
            <CardDetail.Content>{block?.extrinsicsCount}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Events</CardDetail.Title>
            <CardDetail.Content>{block?.eventsCount}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>EVM Transactions</CardDetail.Title>
            <CardDetail.Content>{block?.transactionsCount}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Spec Version</CardDetail.Title>
            <CardDetail.Content>{block?.spec}</CardDetail.Content>
          </CardDetail.Wrapper>
        </div>
      </CardContent>
    </Card>
  );
}
