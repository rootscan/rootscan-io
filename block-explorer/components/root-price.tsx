import { ErrorAlert } from '@/components/error-alert';
import { ApiCommand, request } from '@/lib/api';
import { cn, formatNumberDollars, handleRequestResult } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

import Tooltip from './tooltip';

export async function RootPrice() {
  try {
    const priceData = handleRequestResult(await request(ApiCommand.getRootPrice));
    if (!priceData?.price) {
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Root</span>
          <span className="text-primary/80">-</span>
        </div>
      );
    }

    return (
      <Tooltip
        text={`Last updated: ${
          priceData?.last_updated ? new Date(priceData.last_updated).toUTCString() : 'Not available'
        }`}
      >
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Root</span>
          <span className="text-primary/80">{formatNumberDollars(priceData.price)}</span>
          {priceData.percent_change_24h != null && (
            <span
              className={cn([
                priceData.percent_change_24h < 0 ? 'text-red-400' : 'text-green-400',
                'flex items-center gap-1',
              ])}
            >
              {priceData.percent_change_24h < 0 ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
              {priceData.percent_change_24h.toFixed(2)}%
            </span>
          )}
        </div>
      </Tooltip>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
