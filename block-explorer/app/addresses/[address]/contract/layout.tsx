import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function Layout({ children, params }: { children: React.ReactNode; params: { address: string } }) {
  const paramsObj = await Promise.resolve(params);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Link href={`/addresses/${paramsObj.address}/contract`}>
            <Button size="sm">Contract</Button>
          </Link>
          <Link href={`/addresses/${paramsObj.address}/contract/read`}>
            <Button size="sm">Read</Button>
          </Link>
          <Link href={`/addresses/${paramsObj.address}/contract/write`}>
            <Button size="sm">Write</Button>
          </Link>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
