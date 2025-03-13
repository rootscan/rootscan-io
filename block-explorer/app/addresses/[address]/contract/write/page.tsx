import CustomConnectWallet from '@/components/custom-connectwallet';
import { getContractVerification } from '@/lib/api';
import { PageProps } from '@/types/page';

import WalletProvider from './components/wallet-provider';
import WriteContract from './components/write-contract';

const getData = async ({ params }: PageProps) => {
  const paramsObj = await params;
  if (!paramsObj.address) {
    return null;
  }
  const chainId = Number(process?.env?.CHAIN_ID);
  const fetchData = await getContractVerification({
    contractAddress: paramsObj.address,
  }).catch(() => {
    return null;
  });

  if (!fetchData) {
    return { chainId };
  }

  const parsedData: { metadata?: unknown; files: unknown[] } = {
    metadata: undefined,
    files: [],
  };
  if (fetchData && !fetchData?.error) {
    for (const file of fetchData) {
      if (file?.name === 'metadata.json') {
        if (file?.content) {
          file.content = JSON.parse(file.content);
        }
        parsedData['metadata'] = file;
      } else {
        parsedData['files'].push(file);
      }
    }
  }
  return { data: parsedData, chainId };
};

export default async function Page({ params }: PageProps) {
  const paramsObj = await params;
  if (!paramsObj.address) {
    return null;
  }
  const result = await getData({ params });
  if (!result) {
    return null;
  }
  const { data, chainId } = result;

  return (
    <WalletProvider chainId={chainId}>
      <div className="flex flex-col gap-4">
        <CustomConnectWallet />
        <WriteContract data={data} address={paramsObj.address} />
      </div>
    </WalletProvider>
  );
}
