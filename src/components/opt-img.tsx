const OPTIMIZED = /\/images\/(?:kits\/|windshield-install-|boxes-(?:glove|shop|pallet|foot)\.|work\/ppf\/ppf-03\.)/;

export function OptImg({
  src,
  alt,
  width,
  height,
  sizes = "(min-width: 900px) 320px, 90vw",
  eager = false,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  eager?: boolean;
  className?: string;
}) {
  const base = src.replace(/^\/images\//, "/images/opt/").replace(/\.jpe?g(\?.*)?$/, "");
  const optimized = OPTIMIZED.test(src);
  return (
    <picture>
      {optimized ? (
        <source
          type="image/webp"
          srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`}
          sizes={sizes}
        />
      ) : null}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
