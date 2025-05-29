import { IExtrinsic } from '@/types/models';

import { Badge } from './ui/badge';

export default function ExtrinsicStatus({
  extrinsic,
  showErrorInfo,
}: {
  extrinsic: IExtrinsic;
  showErrorInfo?: boolean;
}) {
  if (!extrinsic) return null;

  return (
    <div>
      {extrinsic?.isSuccess === false ? (
        <div className="flex items-center gap-1">
          <Badge color="orange">Failed</Badge>
          {showErrorInfo ? <Badge type="linear">Reason: {extrinsic?.errorInfo || 'Unknown'}</Badge> : null}
        </div>
      ) : (
        <Badge color="green">Success</Badge>
      )}
    </div>
  );
}
