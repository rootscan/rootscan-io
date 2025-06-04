import { camelCaseToWords } from '@/lib/utils';
import Image from 'next/image';

import { Badge } from './ui/badge';

export default function ExtrinsicMethod({ tx, hideExtrinsic = false }) {
  // Check if we have both badges to show
  const hasExtrinsicData = !hideExtrinsic && tx?.extrinsicData?.section && tx?.extrinsicData?.method;

  return (
    <div className="flex flex-col gap-1">
      {hasExtrinsicData ? (
        <div className="flex items-start gap-0.5">
          {/* Arrow icon positioned to span both badges */}
          <div className="shrink-0">
            <Image src="/arrow-connector.svg" width={16} height={44} alt="Connected method" className="h-11 w-4" />
          </div>
          {/* Badges column */}
          <div className="flex flex-col items-start gap-1">
            <Badge>
              {camelCaseToWords(tx?.extrinsicData?.section)} {camelCaseToWords(tx?.extrinsicData?.method)}
            </Badge>
            <Badge>
              {camelCaseToWords(tx?.section)} {camelCaseToWords(tx?.method)}
            </Badge>
          </div>
        </div>
      ) : (
        /* Single badge with left padding to align with two-badge layout */
        <div className="flex items-start gap-0.5">
          {/* Spacer to match arrow width */}
          <div className="w-4 shrink-0" />
          <Badge>
            {camelCaseToWords(tx?.section)} {camelCaseToWords(tx?.method)}
          </Badge>
        </div>
      )}
    </div>
  );
}
