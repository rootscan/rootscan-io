import CardDetail from '@/components/ui/card-detail';
import { getContractVerification } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import CodeEditor from './components/code-editor';

const getData = async ({ params }) => {
  const fetchData = await getContractVerification({
    contractAddress: params.address,
  }).catch((e) => {
    return null;
  });

  if (!fetchData) {
    return null;
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
  return parsedData;
};

export default async function Page({ params }) {
  const data = await getData({ params });

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <p>This contract is not verified.</p>
        <p className="text-muted-foreground text-sm">
          If you wish to verify this contract please follow the tutorial{' '}
          <Link href="https://docs.sourcify.dev/docs/how-to-verify/" className="text-primary" target="_blank">
            here.
          </Link>
        </p>
        <p>Frameworks Supported</p>
        <div className="flex flex-wrap items-center gap-4">
          {[
            {
              title: 'Foundry',
              logo: '/toolkits/foundry-logo.png',
              url: 'https://docs.sourcify.dev/docs/how-to-verify/#foundry',
            },
            {
              title: 'Hardhat',
              logo: '/toolkits/hardhat-logo.png',
              url: 'https://docs.sourcify.dev/docs/how-to-verify/#hardhat',
            },
            {
              title: 'Truffle',
              logo: '/toolkits/truffle-logo.png',
              url: 'https://docs.sourcify.dev/docs/how-to-verify/#truffle',
            },
            {
              title: 'Remix',
              logo: '/toolkits/remix-logo.png',
              className: 'invert-0 dark:invert',
              url: 'https://docs.sourcify.dev/docs/how-to-verify/#remix-plugin',
            },
            {
              title: 'UI Legacy',
              logo: '/toolkits/sourcify-logo.png',
              url: 'https://docs.sourcify.dev/docs/how-to-verify/#using-the-ui-legacy',
            },
          ].map((item, _) => (
            <Link href={item.url} target="_blank" key={_}>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-3">
                <Image
                  src={item?.logo}
                  width={500}
                  height={500}
                  unoptimized
                  priority
                  className={cn([item?.className ? item.className : '', 'size-12'])}
                  alt="foundry"
                />
                <p className="text-muted-foreground text-xs">{item?.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground">Contract Source Code Verified (Exact Match)</p>
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <AlertTriangle className="size-5 text-orange-400" />
        Source code verification does not imply that the contract is safe to interact with.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CardDetail.Wrapper>
          <CardDetail.Title>Contract Name</CardDetail.Title>
          <CardDetail.Content>
            {data?.metadata?.content?.settings?.compilationTarget?.[
              Object.keys(data?.metadata?.content?.settings?.compilationTarget)?.[0]
            ]
              ? data?.metadata?.content?.settings?.compilationTarget?.[
                  Object.keys(data?.metadata?.content?.settings?.compilationTarget)?.[0]
                ]
              : '-'}
          </CardDetail.Content>
        </CardDetail.Wrapper>
        <CardDetail.Wrapper>
          <CardDetail.Title>Compiler Version</CardDetail.Title>
          <CardDetail.Content>{data?.metadata?.content?.compiler?.version}</CardDetail.Content>
        </CardDetail.Wrapper>
        <CardDetail.Wrapper>
          <CardDetail.Title>Optimization Enabled</CardDetail.Title>
          <CardDetail.Content>
            {data?.metadata?.settings?.optimizer?.enabled
              ? `Yes with ${data?.metadata?.settings?.optimizer?.runs || '0'} runs`
              : 'Disabled'}
          </CardDetail.Content>
        </CardDetail.Wrapper>
        <CardDetail.Wrapper>
          <CardDetail.Title>Other Settings</CardDetail.Title>
          <CardDetail.Content>default evmVersion</CardDetail.Content>
        </CardDetail.Wrapper>
      </div>
      <div className="flex flex-col gap-6">
        {data?.files?.map((item, _) => (
          <CodeEditor
            fileName={`File ${_ + 1} of ${data?.files?.length} - ${item?.name}`}
            key={_}
            value={item?.content}
          />
        ))}
      </div>

      <CodeEditor
        fileName={'ABI'}
        value={
          data?.metadata?.content?.output?.abi ? JSON.stringify(data?.metadata?.content?.output?.abi, null, 4) : ''
        }
      />

      {/* <div></div> */}
      {/* ABI */}
      {/* <div></div> */}
      {/* Contract Creation Code */}
      {/* <div></div> */}
      {/* Deployed Bytecode */}
      {/* <div></div> */}
      {/* Contructor Arguments */}
      {/* <div></div> */}
    </div>
  );
}
