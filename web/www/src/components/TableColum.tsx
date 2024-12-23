import clsx from "clsx";
import { useMemo } from "react";
import { MdArrowDownward } from "react-icons/md";

type TableColumnProps<T> = {
  value: T;
  selected: T | null;
  onSelect: (value: T) => void;
  className?: string;
};
export default function TableColumn<T>({
  children,
  value,
  selected,
  onSelect,
  className,
}: React.PropsWithChildren<TableColumnProps<T>>) {
  const isSelected = useMemo(() => value === selected, [selected]);
  return (
    <th
      className={clsx(
        className,
        "group cursor-pointer font-medium",
        isSelected
          ? "text-white dark:hover:text-white"
          : "text-black/75  hover:text-black dark:text-white/25 dark:hover:text-white"
      )}
      onClick={() => onSelect(value)}
    >
      <MdArrowDownward
        className={clsx(
          "text-xl inline m-auto",
          isSelected ? "visible" : "invisible group-hover:visible"
        )}
      />
      <span>{children}</span>
    </th>
  );
}
