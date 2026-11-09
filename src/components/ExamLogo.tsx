type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
};

/** Exam emblem with explicit dimensions to reduce CLS and oversized downloads. */
export function ExamLogo({
  src,
  alt,
  size = 40,
  className = 'max-h-full max-w-full object-contain',
  loading = 'lazy',
  fetchPriority = 'auto',
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
