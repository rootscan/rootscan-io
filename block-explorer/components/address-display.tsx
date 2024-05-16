import { getAddressName, knownAddressNames } from '@/lib/constants/knownAddresses';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Address, getAddress, isAddress } from 'viem';

import { CopyButton } from './copy-button';
import Logo from './logo';
import Tooltip from './tooltip';

interface AddressDisplayProps {
  address: Address;
  nameTag?: string;
  rnsName?: string | null;
  isContract?: boolean;
  hideCopyButton?: boolean;
  useShortenedAddress?: boolean;
  className?: string;
  isTokenTracker?: boolean;
}

export default function AddressDisplay({
  address,
  nameTag,
  rnsName,
  isContract = false,
  hideCopyButton,
  useShortenedAddress = false,
  className,
  isTokenTracker,
}: AddressDisplayProps) {
  if (!address || !isAddress(address)) return null;
  const name = knownAddressNames[getAddress(address)]
    ? knownAddressNames[getAddress(address)]
    : rnsName
    ? rnsName
    : nameTag
    ? nameTag
    : getAddressName(address, useShortenedAddress);

  const isFuturepass = address?.toLowerCase()?.startsWith('0xffffffff');

  return (
    <div className={cn(['flex items-center gap-2', className ? className : ''])}>
      {isContract ? (
        <Tooltip text="EVM Contract" asChild>
          <FileText className="text-muted-foreground size-4" />
        </Tooltip>
      ) : null}
      {isFuturepass ? (
        <Tooltip text="Futurepass">
          <Logo className="size-4" />
        </Tooltip>
      ) : null}
      <Tooltip text={address} disabled={!useShortenedAddress} asChild>
        <Link href={`/${isTokenTracker ? 'token' : 'addresses'}/${address}`} className="truncate">
          {name}
        </Link>
      </Tooltip>
      {!hideCopyButton || !address ? <CopyButton value={address} /> : null}
    </div>
  );
}
