'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Menu() {
  const { extrinsicId } = useParams();
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap items-center gap-4">
      {[
        { title: 'Overview', href: `/extrinsics/${extrinsicId}` },
        { title: 'Events', href: `/extrinsics/${extrinsicId}/events` },
      ].map((item, _) => (
        <Link href={item.href} key={_}>
          <Button variant={pathname === item.href ? 'default' : 'outline'}>{item.title}</Button>
        </Link>
      ))}
    </div>
  );
}
