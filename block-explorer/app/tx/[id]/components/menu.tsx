'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Menu() {
  const { id } = useParams();
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap items-center gap-4">
      {[
        { title: 'Overview', href: `/tx/${id}` },
        { title: 'Logs', href: `/tx/${id}/logs` },
      ].map((item, _) => (
        <Link href={item.href} key={_}>
          <Button variant={pathname === item.href ? 'default' : 'outline'}>{item.title}</Button>
        </Link>
      ))}
    </div>
  );
}
