'use client';

import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { performSearchMainSearch } from '@/lib/helpers.ts';
import { RiSearchLine } from '@remixicon/react';

export const Search = () => {
  const [value, setValue] = useState('');

  const handleSearch = async () => {
    if (!value.trim()) return;
    await performSearchMainSearch(value);
    setValue('');
  };

  const handlePress = async (e: KeyboardEvent) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex items-center gap-4 rounded-[14px] bg-white p-2 dark:bg-black">
      <input
        className="h-10 flex-1 bg-transparent pl-2 text-sm font-normal placeholder:text-foreground/60 focus:outline-none"
        placeholder="Search by address / txn hash / block..."
        value={value}
        onChange={handleChangeValue}
        onKeyDown={handlePress}
      />
      <Button className="p-2.5" onClick={() => handleSearch()}>
        <RiSearchLine className="size-5" />
      </Button>
    </div>
  );
};
