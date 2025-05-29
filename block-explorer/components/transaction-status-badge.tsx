import { AlertCircle, Check, Clock } from 'lucide-react';

import { Badge } from './ui/badge';

export default function TransactionStatusBadge({ status }: { status: 'reverted' | 'success' | 'pending' }) {
  if (status === 'reverted') {
    return (
      <Badge color="orange">
        <div className="flex items-center gap-1">
          <AlertCircle className="size-4" /> Reverted
        </div>
      </Badge>
    );
  } else if (status === 'success') {
    return (
      <Badge color="green">
        <div className="flex items-center gap-1">
          <Check className="size-4" /> Success
        </div>
      </Badge>
    );
  } else if (!status) {
    return (
      <Badge color="blue">
        {' '}
        <div className="flex items-center gap-1">
          <Clock className="size-4" /> Pending
        </div>
      </Badge>
    );
  }
}
