import clsx from "clsx";

type AvatarProps = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function Avatar({
  width,
  height,
  src,
  alt,
  className,
}: AvatarProps) {
  return src ? (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={clsx(className, "rounded-full shadow shrink-0")}
    />
  ) : (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="fill-white/5 dark:fill-dark-50 animate-pulse"
        width="100"
        height="100"
        rx="50"
        fill="white"
      />
    </svg>
  );
}
