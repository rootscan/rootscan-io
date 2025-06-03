'use client';

import getTokenLogo from '@/lib/constants/tokenLogos';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Address } from 'viem';

export default function TokenLogo({
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
  const { resolvedTheme } = useTheme();
  const logoUrl = getTokenLogo(contractAddress);

  // If we have a specific logo, use it
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
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

  const placeholderSrc =
    resolvedTheme === 'dark' ? '/logos/token-placeholder-dark.svg' : '/logos/token-placeholder-light.svg';

  return (
    <Image
      src={placeholderSrc}
      width={width}
      height={height}
      alt="token_placeholder"
      unoptimized
      priority
      quality={100}
      className={cn(['shrink-0 rounded-full', className ? className : ''])}
    />
  );
}
