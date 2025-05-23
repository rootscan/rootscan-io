'use client'

import { RiSearchLine } from '@remixicon/react';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { performSearchMainSearch } from '@/lib/helpers.ts';

export const Search = () => {
  const [value, setValue] = useState('');

  const handleSearch = async () => {
    if (!value.trim()) return;
    await performSearchMainSearch(value);
    setValue('');
  }

  const handlePress = async (e: KeyboardEvent) => {
    if (e?.key === 'Enter') {
      handleSearch()
    }
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex items-center gap-4 rounded-[14px] bg-white p-2 dark:bg-black">
      <input
        className="bg-transparent flex-1 h-10 pl-2 text-sm font-normal placeholder:text-foreground/60 focus:outline-none"
        placeholder="Search by address / txn hash / block..."
        value={value}
        onChange={handleChangeValue}
        onKeyDown={handlePress}
      />
      <Button className="p-2.5" onClick={() => handleSearch()}>
        <RiSearchLine className="size-5" />
      </Button>
    </div>
  )
}
