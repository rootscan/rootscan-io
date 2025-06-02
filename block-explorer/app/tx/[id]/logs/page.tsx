import AddressDisplay from '@/components/address-display.tsx';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import CardDetail from '@/components/ui/card-detail.tsx';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Hash, getAddress } from 'viem';

export default async function Page({ params }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.id) {
      throw new Error('Transaction ID is required');
    }

    const data = handleRequestResult(await request(ApiCommand.getTransaction, { hash: paramsObj.id as Hash }));

    const logs = data?.logs;
    if (!logs?.length) return <NoData />;

    return (
      <div className="flex flex-col gap-4">
        {logs.map((log, _) => (
          <div key={_} className="flex flex-col gap-5 rounded-[16px] bg-surface-container p-6">
            <h4 className="text-[18px]/[28px] font-semibold">Log {log.logIndex}</h4>
            <CardDetail.Wrapper>
              <CardDetail.Title>Address</CardDetail.Title>
              <CardDetail.Content>
                <AddressDisplay address={getAddress(log.address)} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Event Name</CardDetail.Title>
              <CardDetail.Content>{log.eventName || '-'}</CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Arguments</CardDetail.Title>
              <CardDetail.Content>
                {log.args ? (
                  <div className="flex flex-col gap-1">
                    {Object.entries(log.args).map(([key, value]) => (
                      <div key={key}>
                        {key}: {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    ))}
                  </div>
                ) : (
                  '-'
                )}
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Topics</CardDetail.Title>
              <CardDetail.Content>
                {log.topics ? (
                  <div className="flex flex-col gap-1">
                    {log.topics.map((topic, i) => (
                      <div key={i}>{topic}</div>
                    ))}
                  </div>
                ) : (
                  '-'
                )}
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Data</CardDetail.Title>
              <CardDetail.Content>{log.data || '-'}</CardDetail.Content>
            </CardDetail.Wrapper>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
