import CardDetail from '@/components/ui/card-detail';
import { getRnsName } from '@/lib/api';
import { Address } from 'viem';

interface RnsNameProps {
  address: Address;
}

export const RnsName = async ({ address }: RnsNameProps) => {
  const rnsName = await getRnsName(address);
  return (
    <CardDetail.Content>
      {<div className="flex items-center gap-2">{rnsName ? rnsName.name : '-'}</div>}
    </CardDetail.Content>
  );
};
