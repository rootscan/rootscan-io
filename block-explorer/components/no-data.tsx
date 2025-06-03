import { Card, CardContent } from '@/components/ui/card';

export default function NoData() {
  return (
    <Card>
      <CardContent className="grid h-[340px] select-none place-items-center py-10 text-center text-sm text-muted-foreground">
        There is no data available.
      </CardContent>
    </Card>
  );
}
