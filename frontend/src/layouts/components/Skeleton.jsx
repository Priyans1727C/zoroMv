export function Skeleton({ className = "", rounded = "rounded-xl" }) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-2/70 ${rounded} ${className}`}
    >
      <div className="shimmer absolute inset-0" />
    </div>
  );
}

import { useState } from "react";

export function LazyImage({src,alt = "image", className = "", skeletonClassName = "",
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <PosterSkeleton
          className={`absolute inset-0 h-full w-full ${skeletonClassName}`}
        />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}






export const  PosterSkeleton = Skeleton; 

