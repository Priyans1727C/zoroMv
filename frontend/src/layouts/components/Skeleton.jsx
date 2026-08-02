export function Skeleton({ className = "", rounded = "rounded-xl" }) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-2/70 ${rounded} ${className}`}
    >
      <div className="shimmer absolute inset-0" />
    </div>
  );
}





export const  PosterSkeleton = Skeleton; 

