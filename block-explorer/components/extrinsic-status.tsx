import { Badge } from './ui/badge';

export default function ExtrinsicStatus({
  extrinsic,
  showErrorInfo,
}: {
  extrinsic: {
    isSuccess?: boolean;
    errorInfo?: string;
  };
  showErrorInfo?: boolean;
}) {
  return (
    <div>
      {extrinsic?.isSuccess === false ? (
        <div className="flex items-center gap-1">
          <Badge variant="destructive">Failed</Badge>
          {showErrorInfo ? <Badge variant="outline">Reason: {extrinsic?.errorInfo || 'Unknown'}</Badge> : null}
        </div>
      ) : (
        <Badge variant="success">Success</Badge>
      )}
    </div>
  );
}
