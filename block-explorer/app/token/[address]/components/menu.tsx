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
            {/*TODO: update according to the design*/}
            <Badge size="md" type={pathname === item.href ? 'linear' : 'filled'}>
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
