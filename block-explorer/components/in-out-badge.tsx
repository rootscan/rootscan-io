import { Badge } from './ui/badge';

export default function InOutBadge({ address, from, to }) {
  if (from === address && to === address) {
    return <Badge color="blue">Self</Badge>;
  }
  if (from === address) {
    return <Badge color="orange">Out</Badge>;
  }
  if (to === address) {
    return <Badge color="green">In</Badge>;
  }
}
