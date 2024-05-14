import { Badge } from './ui/badge';

export default function InOutBadge({ address, from, to }: any) {
  if (from === address && to === address) {
    return <Badge variant="info">Self</Badge>;
  }
  if (from === address) {
    return <Badge variant="warning">Out</Badge>;
  }
  if (to === address) {
    return <Badge variant="success">In</Badge>;
  }
}
