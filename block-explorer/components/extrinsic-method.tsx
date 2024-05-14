import { Fragment } from 'react';

import { camelCaseToWords } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

import { Badge } from './ui/badge';

export default function ExtrinsicMethod({ tx, hideExtrinsic = false }) {
  return (
    <div className="flex flex-col gap-1">
      {!hideExtrinsic && tx?.extrinsicData?.section && tx?.extrinsicData?.method ? (
        <Fragment>
          <div>
            <Badge>
              {camelCaseToWords(tx?.extrinsicData?.section)} {camelCaseToWords(tx?.extrinsicData?.method)}
            </Badge>
          </div>
          <ChevronDown className="text-muted-foreground size-4" />
        </Fragment>
      ) : null}
      <div>
        <Badge>
          {camelCaseToWords(tx?.section)} {camelCaseToWords(tx?.method)}
        </Badge>
      </div>
    </div>
  );
}
