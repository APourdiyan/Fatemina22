export default function SkeletonCard() {
  return (
    <div className="content-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-16 h-6 bg-muted rounded-full" />
        <div className="w-12 h-4 bg-muted rounded" />
      </div>
      <div className="w-3/4 h-5 bg-muted rounded mb-2" />
      <div className="w-full h-4 bg-muted rounded mb-1" />
      <div className="w-2/3 h-4 bg-muted rounded mb-4" />
      <div className="flex gap-4">
        <div className="w-16 h-3 bg-muted rounded" />
        <div className="w-12 h-3 bg-muted rounded" />
      </div>
    </div>
  );
}
