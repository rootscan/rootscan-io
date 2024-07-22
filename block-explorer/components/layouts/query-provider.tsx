'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TooltipProvider } from '../ui/tooltip';

const queryClient = new QueryClient();

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}
