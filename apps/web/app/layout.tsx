import type { Metadata } from 'next';
import { Syne, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'GenAISAP | Institutional Intelligence Hub',
  description: 'Enterprise AI assistant platform for SAP S/4HANA ecosystems',
};

import { PostHogProvider } from '@/components/posthog-provider';
import PostHogPageView from '@/components/posthog-pageview';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} dark`} 
      suppressHydrationWarning
      style={{ colorScheme: 'dark' }}
    >
      <body className="antialiased bg-background text-text-primary">
      <ThemeProvider defaultTheme="dark">
        <PostHogProvider>
          <PostHogPageView />
          <QueryProvider>
            {children}
          </QueryProvider>
        </PostHogProvider>
      </ThemeProvider>
    </body>
    </html>
  );
}
