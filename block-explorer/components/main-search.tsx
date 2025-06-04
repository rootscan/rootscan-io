'use client';

import { ChangeEvent, KeyboardEvent as ReactKeyboardEvent, useRef, useState } from 'react';

import { performSearchMainSearch } from '@/lib/helpers';
import { useKeyDown } from '@/lib/hooks/useKeyDown.ts';
import { RiSearchLine } from '@remixicon/react';

import { Input } from './ui/input';

export default function MainSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');

  const handlePress = async (e: ReactKeyboardEvent) => {
    if (e?.key === 'Enter') {
      await performSearchMainSearch(value);
      setValue('');
    }
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleFocus = (event?: KeyboardEvent) => {
    // Allow focus from any element except input fields to prevent interference with typing
    if (event && document.activeElement && document.activeElement.tagName === 'INPUT') return;
    event?.preventDefault();
    event?.stopPropagation();
    setTimeout(() => inputRef.current?.focus());
  };

  useKeyDown('/', handleFocus);
  useKeyDown('Escape', () => inputRef.current?.blur());

  return (
    <div className="relative">
      <RiSearchLine className="absolute left-3 top-2 -z-10 size-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        className="h-8 px-9 focus:outline-0"
        placeholder="Search by address / txn hash / block..."
        value={value}
        onChange={handleChangeValue}
        onKeyDown={handlePress}
      />
      <div className="absolute right-1.5 top-1.5 -z-10 m-auto flex size-5 items-center justify-center rounded-[4px] bg-[#F5F5F5] text-muted-foreground dark:bg-[#1C1C1C]">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M8.06061 2.33337H9.33334L5.9394 11.6667H4.66667L8.06061 2.33337Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
