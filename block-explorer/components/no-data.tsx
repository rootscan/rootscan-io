import { Card, CardContent } from '@/components/ui/card';

export default function NoData() {
  return (
    <Card>
      <CardContent className="grid h-[33vh] select-none place-items-center py-10 text-center text-muted-foreground">
        There is no data available.
      </CardContent>
    </Card>
  );
}
