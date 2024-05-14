import CustomConnectWallet from '@/components/custom-connectwallet';
import { getContractVerification } from '@/lib/api';

import WalletProvider from './components/wallet-provider';
import WriteContract from './components/write-contract';

const getData = async ({ params }) => {
  const chainId = Number(process?.env?.CHAIN_ID);
  const fetchData = await getContractVerification({
    contractAddress: params.address,
  }).catch((e) => {
    return null;
  });

  if (!fetchData) {
    return { chainId };
  }

  let parsedData: { metadata?: any; files: any[] } = {
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

export default async function Page({ params }: { params: any }) {
  const { data, chainId } = await getData({ params });

  return (
    <WalletProvider chainId={chainId}>
      <div className="flex flex-col gap-4">
        <CustomConnectWallet />
        <WriteContract data={data} address={params.address} />
      </div>
    </WalletProvider>
  );
}
