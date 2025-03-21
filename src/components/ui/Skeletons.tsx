export const Skeleton = ({ className }: { className?: string }) => (
  <div
    data-testid="skeleton"
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
  />
);
