/** Lightweight shell shown while lazy routes load — fixed layout to limit CLS. */
export default function RouteLoadingFallback() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#e8ecf1] px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-[#0b3d91]" />
      <p className="mt-4 text-sm font-medium text-slate-600">Loading…</p>
    </div>
  );
}
