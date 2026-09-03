'use client';

import { ErrorState } from './components/ui';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-4 py-12"><ErrorState onRetry={reset} /></main>;
}