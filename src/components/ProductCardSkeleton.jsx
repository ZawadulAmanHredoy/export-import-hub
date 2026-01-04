// client/src/components/ProductCardSkeleton.jsx
export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-44 w-full bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="mt-auto h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
