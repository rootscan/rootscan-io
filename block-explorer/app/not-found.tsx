import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="grid h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl font-bold">Not found</div>
        <div className="text-muted-foreground text-xl font-bold">This page does not exist.</div>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
