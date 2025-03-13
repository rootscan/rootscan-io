import { getContractVerification } from '@/lib/api';
import { PageProps } from '@/types/page';
import { Address } from 'viem';

import ReadContract from './components/read-contract';

const getData = async ({ params }: PageProps) => {
  const paramsObj = await params;
  if (!paramsObj.address) {
    return { chainId: Number(process?.env?.CHAIN_ID) };
  }
  const chainId = Number(process?.env?.CHAIN_ID);
  const fetchData = await getContractVerification({
    contractAddress: paramsObj.address as Address,
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
      if (file.name === 'metadata.json') {
        if (file.content) {
          file.content = JSON.parse(file.content);
        }
        parsedData.metadata = file;
      } else {
        parsedData.files.push(file);
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
  const { data, chainId } = await getData({ params });
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs">Read Contract Information</span>
      <ReadContract data={data} address={paramsObj.address as Address} chainId={chainId} />
    </div>
  );
}
