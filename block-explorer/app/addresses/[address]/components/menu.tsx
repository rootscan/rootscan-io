'use client';

import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Menu({
  isContract = false,
  isVerified = false,
}: {
  isContract?: boolean;
  isVerified?: boolean;
}) {
  const { address } = useParams();
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-4 overflow-auto">
      {[
        { title: 'Native Transfers', href: `/addresses/${address}` },
        { title: 'Extrinsics', href: `/addresses/${address}/extrinsics` },
        { title: 'EVM Transfers', href: `/addresses/${address}/evm-transfers` },
        {
          title: 'EVM Transactions',
          href: `/addresses/${address}/evm-transactions`,
        },
        {
          title: 'Contract',
          hasCheckmark: isContract && isVerified,
          href: `/addresses/${address}/contract`,
        },
        { title: 'Token Balances', href: `/addresses/${address}/balances` },
        { title: 'NFT Inventory', href: `/addresses/${address}/nft-inventory` },
        {
          title: 'Bridge Transactions',
          href: `/addresses/${address}/bridge-transactions`,
        },
        {
          title: 'Futurepass',
          href: `/addresses/${address}/futurepass`,
        },
        {
          title: 'Reports',
          href: `/addresses/${address}/reports`,
        },
      ].map((item, _) => {
        if (!isContract && item?.title === 'Contract') return null;
        return (
          <Link href={item.href} key={_}>
            <Badge
              variant={pathname === item.href ? 'default' : 'secondary'}
              className="h-[32px] !max-h-[32px] rounded-xl text-xs font-normal capitalize"
            >
              <div className="flex items-center gap-1">
                <span>{item.title}</span>
                {item.hasCheckmark ? (
                  <div className="inline-flex size-4 rounded-full bg-green-600 dark:bg-green-400 dark:text-black">
                    <Check className="m-auto size-3" />
                  </div>
                ) : null}
              </div>
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
