'use client';

import dynamic from 'next/dynamic';

const ClientProgressBar = dynamic(() => import('./client-progressbar'), {
  ssr: false,
});

export default function ProgressBarWrapper() {
  return <ClientProgressBar />;
} 