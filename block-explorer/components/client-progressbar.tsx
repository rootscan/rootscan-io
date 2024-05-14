'use client';

import { Fragment, Suspense } from 'react';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useTheme } from 'next-themes';

export default function ClientProgressBar() {
  const { theme } = useTheme();
  return (
    <Suspense fallback={<Fragment />} key={theme}>
      <ProgressBar
        key={theme}
        height="4px"
        color={theme === 'dark' ? '#ffff' : '#000'}
        options={{ showSpinner: true }}
        shallowRouting
      />
    </Suspense>
  );
}
