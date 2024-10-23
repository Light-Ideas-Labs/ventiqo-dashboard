'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { getServerSession } from "next-auth";

export default function Providers({ children }: { 
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
