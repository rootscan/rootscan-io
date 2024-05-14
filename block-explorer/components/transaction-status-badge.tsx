import { AlertCircle, Check, Clock } from 'lucide-react';

import { Badge } from './ui/badge';

export default function TransactionStatusBadge({ status }: { status: 'reverted' | 'success' | 'pending' }) {
  if (status === 'reverted') {
    return (
      <Badge variant="destructive">
        <div className="flex items-center gap-1">
          <AlertCircle className="size-4" /> Reverted
        </div>
      </Badge>
    );
  } else if (status === 'success') {
    return (
      <Badge variant="success">
        <div className="flex items-center gap-1">
          <Check className="size-4" /> Success
        </div>
      </Badge>
    );
  } else if (!status) {
    return (
      <Badge variant="info">
        {' '}
        <div className="flex items-center gap-1">
          <Clock className="size-4" /> Pending
        </div>
      </Badge>
    );
  }
}
