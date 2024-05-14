'use client';

import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Menu() {
  const { address } = useParams();
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-4 overflow-auto">
      {[
        { title: 'Holders', href: `/token/${address}` },
        {
          title: 'Contract',
          href: `/addresses/${address}/contract`,
        },
      ].map((item, _) => {
        return (
          <Link href={item.href} key={_}>
            <Badge
              variant={pathname === item.href ? 'default' : 'secondary'}
              className="h-[32px] !max-h-[32px] rounded-xl text-xs font-normal capitalize"
            >
              <div className="flex items-center gap-1">
                <span>{item.title}</span>
              </div>
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
