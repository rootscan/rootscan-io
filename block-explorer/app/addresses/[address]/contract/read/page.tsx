import { getContractVerification } from '@/lib/api';

import ReadContract from './components/read-contract';

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
    <div className="flex flex-col gap-4">
      <span className="text-xs">Read Contract Information</span>
      <ReadContract data={data} address={params.address} chainId={chainId} />
    </div>
  );
}
