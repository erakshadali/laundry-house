import Image from "next/image";

/** Fills its (relative) parent. */
export function Photo({
  src,
  alt,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  position = "center",
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
  position?: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
