import { Skeleton } from './components/ui';

export default function Loading() {
  return <main className="mx-auto max-w-7xl space-y-4 px-4 py-8 md:px-8"><Skeleton className="h-10 w-56" /><Skeleton className="h-24 w-full" /><div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div></main>;
}