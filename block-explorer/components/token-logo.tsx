import getTokenLogo from '@/lib/constants/tokenLogos';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Address } from 'viem';

export default async function TokenLogo({
  contractAddress,
  width,
  height,
  className,
}: {
  contractAddress: Address;
  width: number;
  height: number;
  className?: string;
}) {
  const url = getTokenLogo(contractAddress);
  if (!url) return <div />;
  return (
    <Image
      src={url}
      width={width}
      height={height}
      alt="token_logo"
      unoptimized
      priority
      quality={100}
      className={cn(['shrink-0 rounded-full', className ? className : ''])}
    />
  );
}
