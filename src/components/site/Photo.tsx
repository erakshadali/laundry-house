import fs from "fs";
import path from "path";
import Image from "next/image";

/** Fills its (relative) parent. Falls back to a dark textured panel if the file is missing. */
export function Photo({
  src,
  alt,
  caption,
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
  const exists = fs.existsSync(path.join(process.cwd(), "public", src));
  if (exists) {
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
  return (
    <div className={`absolute inset-0 flex items-end bg-coal p-5 ${className}`} role="img" aria-label={alt}>
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold/60">{caption ?? alt}</span>
    </div>
  );
}
