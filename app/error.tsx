'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-black tracking-tight text-white uppercase">Neural Node Fault</h3>
        <p className="text-slate-400 text-sm">
          A processing error occurred in this module. The incident has been automatically cataloged in Sentry.
        </p>
        {error.message && (
          <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
            <code className="text-xs font-mono text-rose-400 block break-all">
              {error.message}
            </code>
          </div>
        )}
      </div>

      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all text-[10px]"
      >
        Retry Component Load
      </button>
    </div>
  );
}
