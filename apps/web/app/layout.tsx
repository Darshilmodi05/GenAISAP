import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
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
      className={`${inter.variable} ${jetbrainsMono.variable} dark`} 
      suppressHydrationWarning
      style={{ colorScheme: 'dark' }}
    >
      <body className="antialiased bg-background text-text-primary">
      <ThemeProvider defaultTheme="dark" forcedTheme="dark">
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
