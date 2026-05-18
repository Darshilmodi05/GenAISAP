'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-[#030305] text-[#E8ECF8] min-h-screen flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Critical Core Crash</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A high-level institutional boundary error occurred. Telemetry and Sentry error systems have logged this breach.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all text-xs"
          >
            Attempt Reconnection
          </button>
        </div>
      </body>
    </html>
  );
}
