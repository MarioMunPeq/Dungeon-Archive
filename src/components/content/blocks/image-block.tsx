interface ImageBlockProps {
  readonly src: string;
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
}

export function ImageBlock({ src, alt, width, height }: ImageBlockProps) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      className="max-w-full h-auto rounded"
      loading="lazy"
    />
  );
}
