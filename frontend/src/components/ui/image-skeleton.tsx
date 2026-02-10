import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  srcSet?: string;
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  containerClassName,
  loading = "lazy",
  srcSet,
  sizes,
  fetchPriority = "auto",
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent skeleton-shimmer" />
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        srcSet={srcSet}
        sizes={sizes}
        //@ts-ignore - fetchPriority is supported in modern browsers but maybe not in current @types/react
        fetchpriority={fetchPriority}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
}
