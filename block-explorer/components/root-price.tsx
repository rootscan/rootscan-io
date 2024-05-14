import { getRootPrice } from '@/lib/api';
import { cn, formatNumberDollars } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

import Tooltip from './tooltip';

const getData = async () => {
  try {
    const priceData = await getRootPrice({});
    return priceData;
  } catch {
    return {};
  }
};

export default async function RootPrice() {
  const priceData = await getData();

  return (
    <Tooltip
      text={`Last updated: ${
        priceData?.last_updated ? new Date(priceData?.last_updated).toUTCString() : 'Not available'
      }`}
    >
      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <span>Root</span>
        <span className="text-primary/80">{priceData?.price ? formatNumberDollars(priceData?.price) : '-'}</span>
        <span
          className={cn([
            priceData?.percent_change_24h < 0 ? 'text-red-400' : 'text-green-400',
            'flex items-center gap-1',
          ])}
        >
          {priceData?.percent_change_24h < 0 ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          {priceData?.percent_change_24h ? priceData?.percent_change_24h.toFixed(2) : '-'}%
        </span>
      </div>
    </Tooltip>
  );
}
