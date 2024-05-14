import getTokenLogo from '@/lib/constants/tokenLogos';
import { cn, formatNumber } from '@/lib/utils';
import { formatUnits } from 'viem';

import AddressDisplay from './address-display';
import TokenLogo from './token-logo';
import Tooltip from './tooltip';

export default async function TokenDisplay({
  token,
  amount,
  hideCopyButton = false,
  overrideImageSizeClass,
  priceData,
  className,
  isTokenTracker,
  hideLogo,
}: {
  token: any;
  amount?: any;
  hideCopyButton?: boolean;
  overrideImageSizeClass?: string;
  priceData?: any;
  className?: string;
  isTokenTracker?: boolean;
  hideLogo?: boolean;
}) {
  const hasLogo = getTokenLogo(token?.contractAddress) || null;
  return (
    <div className={cn(['flex items-center gap-2 truncate', className ? className : ''])}>
      {!isNaN(amount) ? (
        <div>{amount ? formatNumber(Number(formatUnits(BigInt(amount), token?.decimals))) : '0'}</div>
      ) : null}
      <Tooltip text={token?.contractAddress} asChild>
        <div className="inline-flex items-center gap-1 truncate">
          {hasLogo && !hideLogo ? (
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
