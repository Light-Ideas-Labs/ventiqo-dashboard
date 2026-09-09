'use client';

import React from 'react';
import { Provider } from 'react-redux'; // ✅ Import Redux Provider
import { store } from '@/state/store'; // ✅ Import the Redux store
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from 'next-auth/react';
import QueryProvider from './query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Provider store={store}> {/* ✅ Wrap Redux Provider here */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SessionProvider>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </QueryProvider>
        </SessionProvider>
      </ThemeProvider>
      </Provider>
    </>
  );
}
