export default function Loading() {
  return (
    <div className="grid gap-6" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded-full bg-white/70" />
      <div className="card h-72 animate-pulse" />
    </div>
  );
}
