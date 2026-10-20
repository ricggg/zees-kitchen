'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-20 text-center">
      <h1 className="h-display text-3xl">Something went wrong</h1>
      <p className="mt-2 text-ink/70">Please try again. If it keeps happening, call us.</p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
