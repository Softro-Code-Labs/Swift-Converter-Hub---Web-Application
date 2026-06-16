'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <ThemeToaster />
    </NextThemesProvider>
  );
}

function ThemeToaster() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#e2e8f0' : '#0f172a',
          border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          borderRadius: '12px',
          fontSize: '13px',
          padding: '12px 14px',
        },

        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: isDark ? '#0f172a' : '#ffffff',
          },
        },

        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: isDark ? '#0f172a' : '#ffffff',
          },
        },
      }}
    />
  );
}
