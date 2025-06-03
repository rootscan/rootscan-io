import { CopyButton } from '@/components/copy-button';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import Timestamp from '@/components/timestamp';
import Tooltip from '@/components/tooltip.tsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { Separator } from '@/components/ui/separator.tsx';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';

export default async function Page({ params }: PageProps) {
  try {
    const { blocknumber } = await params;
    if (!blocknumber) {
      throw new Error('Block number is required');
    }
    if (Number(blocknumber) < 0) {
      throw new Error('There is no block lower than 0.');
    }

    const block = handleRequestResult(await request(ApiCommand.getBlock, { number: blocknumber }));
    if (!block) return <NoData />;

    return (
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <CardDetail.Wrapper>
            <CardDetail.Title>Block</CardDetail.Title>
            <CardDetail.Content>
              <div>{block.number}</div>
              <div className="flex items-center gap-1">
                <Tooltip text="View previous block">
                  <Link href={`/blocks/${Number(block.number) - 1}`}>
                    <Button size="xs" variant="secondary">
                      <RiArrowLeftSLine className="size-[14px]" />
                    </Button>
                  </Link>
                </Tooltip>
                <Tooltip text="View next block">
                  <Link href={`/blocks/${Number(block.number) + 1}`}>
                    <Button size="xs" variant="secondary">
                      <RiArrowRightSLine className="size-[14px]" />
                    </Button>
                  </Link>
                </Tooltip>
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Timestamp</CardDetail.Title>
            <CardDetail.Content>
              <Timestamp date={block.timestamp} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Status</CardDetail.Title>
            <CardDetail.Content>
              {block.isFinalized ? <Badge color="green">Finalized</Badge> : <Badge color="orange">Unfinalized</Badge>}
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>Hash</CardDetail.Title>
            <CardDetail.Content>
              <span className="truncate">{block.hash}</span>
              <CopyButton value={block.hash} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Parent Hash</CardDetail.Title>
            <CardDetail.Content>
              <Link href={`/blocks/${block.number - 1}`} className="truncate">
                <span>{block.parentHash}</span>
              </Link>
              <CopyButton value={block.parentHash} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>State Root</CardDetail.Title>
            <CardDetail.Content>
              <span className="truncate">{block.stateRoot}</span>
              <CopyButton value={block.stateRoot} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsics Root</CardDetail.Title>
            <CardDetail.Content>
              <span className="truncate">{block.extrinsicsRoot}</span>
              <CopyButton value={block.extrinsicsRoot} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsics</CardDetail.Title>
            <CardDetail.Content>{block.extrinsicsCount}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Events</CardDetail.Title>
            <CardDetail.Content>{block.eventsCount}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>EVM Transactions</CardDetail.Title>
            <CardDetail.Content>{block.transactionsCount}</CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Spec Version</CardDetail.Title>
            <CardDetail.Content>{block.spec}</CardDetail.Content>
          </CardDetail.Wrapper>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
