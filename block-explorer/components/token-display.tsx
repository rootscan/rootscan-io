import { cn, formatNumber } from '@/lib/utils';
import { IToken } from '@/types/models';
import { formatUnits } from 'viem';

import AddressDisplay from './address-display';
import TokenLogo from './token-logo';
import Tooltip from './tooltip';

export default function TokenDisplay({
  token,
  amount,
  hideCopyButton = false,
  overrideImageSizeClass,
  className,
  isTokenTracker,
  hideLogo,
}: {
  token?: IToken;
  amount?: bigint | number;
  hideCopyButton?: boolean;
  overrideImageSizeClass?: string;
  className?: string;
  isTokenTracker?: boolean;
  hideLogo?: boolean;
}) {
  if (!token) {
    return;
  }

  return (
    <div className={cn(['flex items-center gap-2 truncate', className ? className : ''])}>
      {!isNaN(amount as number) ? (
        <div>{amount ? formatNumber(Number(formatUnits(BigInt(amount), token?.decimals || 0))) : '0'}</div>
      ) : null}
      <Tooltip text={token?.contractAddress} asChild>
        <div className="inline-flex items-center gap-1 truncate">
          {!hideLogo ? (
            <div className={cn([overrideImageSizeClass ? overrideImageSizeClass : 'size-5', 'shrink-0'])}>
              <TokenLogo contractAddress={token?.contractAddress} width={250} height={250} />
            </div>
          ) : null}

          <AddressDisplay
            address={token?.contractAddress}
            nameTag={`${token?.name} ${token?.symbol ? `(${token?.symbol})` : ''}`}
            hideCopyButton={hideCopyButton}
            className="truncate"
            isTokenTracker={isTokenTracker}
          />
        </div>
      </Tooltip>
    </div>
  );
}
