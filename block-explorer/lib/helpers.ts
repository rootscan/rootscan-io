'use server';

import { getAddressFromRnsName } from '@/lib/api';
import { redirect } from 'next/navigation';
import { isAddress, isHash, isHex } from 'viem';

export const performSearchMainSearch = async (val: string) => {
  'use server';
  if (!val) return;
  const value = val.trim();
  // Is RNS Name
  let addressFrom;
  try {
    addressFrom = await getAddressFromRnsName(value);
  } catch (e) {
    console.error(e);
  }
  if (addressFrom) {
    return redirect(`/addresses/${addressFrom}`);
  }
  // Is Address
  if (isAddress(value)) {
    return redirect(`/addresses/${value}`);
  }
  // Is Tx Hash
  if (isHash(value) && value?.length == 66) {
    return redirect(`/tx/${value}`);
  }

  if (value?.includes('-')) {
    const splitted = value?.split('-');
    if (splitted?.length === 2 || splitted?.length === 3) {
      if (!isNaN(Number(splitted[0])) && !isNaN(Number(splitted[1]))) {
        return redirect(`/extrinsics/${value}`);
      }
    }
  }
  // Is Block
  if (Number.isInteger(parseInt(value)) && !isHex(value)) {
    return redirect(`/blocks/${value}`);
  }

  return 'NOT_FOUND';
};
