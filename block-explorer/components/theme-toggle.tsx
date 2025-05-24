'use client';

import { RiComputerLine, RiSunLine, RiMoonLine } from '@remixicon/react'
import { useTheme } from 'next-themes';

import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger } from '@/components/ui/segmented-control';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SegmentedControl size="sm" value={theme} onValueChange={setTheme}>
        <SegmentedControlList aria-label="Toggle theme">
          <SegmentedControlTrigger value="system" aria-label="System" icon={<RiComputerLine />} />
          <SegmentedControlTrigger value="light" aria-label="Light" icon={<RiSunLine />} />
          <SegmentedControlTrigger value="dark" aria-label="Dark" icon={<RiMoonLine />} />
        </SegmentedControlList>
      </SegmentedControl>
      <div className="hidden">{theme?.toString()}</div>
    </>
  );
}
