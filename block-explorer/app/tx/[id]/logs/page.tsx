import AddressDisplay from '@/components/address-display';
import NoData from '@/components/no-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { getTransaction } from '@/lib/api';

const getData = async ({ params }: any) => {
  const data = await getTransaction({ hash: params.id });
  return data;
};
export default async function Page({ params }) {
  const data = await getData({ params });
  const logs = data?.logs;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      {logs?.length ? (
        <CardContent>
          <div className="flex max-w-full flex-col gap-6">
            {logs?.map((item, _) => (
              <div className="flex gap-4" key={_}>
                <div>
                  <Button size="icon">{item.logIndex}</Button>
                </div>
                <div>
                  <div className="flex flex-col gap-6">
                    <CardDetail.Wrapper>
                      <CardDetail.Title>
                        <div>Address</div>
                      </CardDetail.Title>
                      <CardDetail.Content>
                        <span className="truncate">
                          <AddressDisplay address={item.address} />
                        </span>
                      </CardDetail.Content>
                    </CardDetail.Wrapper>
                    {/* Event Name */}
                    {item?.eventName ? (
                      <CardDetail.Wrapper>
                        <CardDetail.Title>
                          <div>Event Name</div>
                        </CardDetail.Title>
                        <CardDetail.Content>{item?.eventName}</CardDetail.Content>
                      </CardDetail.Wrapper>
                    ) : null}
                    {item?.args ? (
                      <CardDetail.Wrapper>
                        <CardDetail.Title>
                          <div>Arguments</div>
                        </CardDetail.Title>
                        <CardDetail.Content>
                          {Object.keys(item.args)?.map((key, x) => (
                            <p key={x}>
                              {key}:{' '}
                              {typeof item?.args?.[key] === 'object'
                                ? JSON.stringify(item?.args?.[key])
                                : String(item?.args?.[key])}
                            </p>
                          ))}
                        </CardDetail.Content>
                      </CardDetail.Wrapper>
                    ) : null}
                    <CardDetail.Wrapper>
                      <CardDetail.Title>
                        <div>Topics</div>
                      </CardDetail.Title>
                      <CardDetail.Content>{item.topics?.map((topic, x) => <p key={x}>{topic}</p>)}</CardDetail.Content>
                    </CardDetail.Wrapper>
                    <CardDetail.Wrapper>
                      <CardDetail.Title>
                        <div>Data</div>
                      </CardDetail.Title>
                      <CardDetail.Content>
                        <p className="break-anywhere">{item.data}</p>
                      </CardDetail.Content>
                    </CardDetail.Wrapper>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <NoData />
      )}
    </Card>
  );
}
