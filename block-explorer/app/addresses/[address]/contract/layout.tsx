import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Layout({ children, params }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Link href={`/addresses/${params.address}/contract`}>
            <Button size="sm">Contract</Button>
          </Link>
          <Link href={`/addresses/${params.address}/contract/read`}>
            <Button size="sm">Read</Button>
          </Link>
          <Link href={`/addresses/${params.address}/contract/write`}>
            <Button size="sm">Write</Button>
          </Link>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
