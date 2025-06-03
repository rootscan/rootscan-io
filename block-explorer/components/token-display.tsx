import { cn, formatNumber } from '@/lib/utils';
import { IToken } from '@/types/models';
import { formatUnits } from 'viem';

import AddressDisplay from './address-display';
import TokenLogo from './token-logo';
import Tooltip from './tooltip';

interface TokenDisplayProps {
  token?: IToken;
  amount?: bigint | number;
  hideCopyButton?: boolean;
  overrideImageSizeClass?: string;
  className?: string;
  isTokenTracker?: boolean;
  hideLogo?: boolean;
  shortFormat?: boolean;
}
export default async function TokenDisplay(props: TokenDisplayProps) {
  const {
    token,
    amount,
    hideCopyButton = false,
    overrideImageSizeClass,
    className,
    isTokenTracker,
    hideLogo,
    shortFormat = false,
  } = props;

  if (!token) {
    return;
  }

  return (
    <Tooltip text={token?.contractAddress} asChild>
      <div className={cn(['inline-flex items-center gap-1 truncate', className ? className : ''])}>
        {!hideLogo ? (
          <div className={cn([overrideImageSizeClass ? overrideImageSizeClass : 'size-5', 'shrink-0'])}>
            <TokenLogo contractAddress={token?.contractAddress} width={250} height={250} />
          </div>
        ) : null}

        {!isNaN(amount as number) ? (
          <div>{amount ? formatNumber(Number(formatUnits(BigInt(amount), token?.decimals || 0))) : '0'}</div>
        ) : null}

        <AddressDisplay
          address={token?.contractAddress}
          nameTag={
            shortFormat
              ? token?.symbol ?? token?.name ?? ''
              : `${token?.name} ${token?.symbol ? `(${token?.symbol})` : ''}`
          }
          hideCopyButton={hideCopyButton}
          className={cn('truncate', shortFormat && 'text-text-secondary')}
          isTokenTracker={isTokenTracker}
        />
      </div>
    </Tooltip>
  );
}
