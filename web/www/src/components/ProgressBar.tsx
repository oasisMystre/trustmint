import clsx from "clsx";
import { format } from "../utils/format";

type ProgressBarProps = {
  values: number[];
  className?: string;
  classNames?: string[];
};

export default function ProgressBar({
  values,
  className,
  classNames = ["bg-green-500", "bg-red-500"],
}: ProgressBarProps) {
  return (
    <div className={clsx("flex bg-black/10 rounded-full dark:bg-dark", className)}>
      {values.map((value, index) => (
        <div
          key={index}
          className={clsx(
            "p-1",
            classNames[index],
            index === 0
              ? "rounded-l"
              : index === values.length - 1
              ? "rounded-r"
              : undefined
          )}
          style={{ width: format("%%", value * 100) }}
        />
      ))}
    </div>
  );
}
