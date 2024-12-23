import clsx from "clsx";
import { ErrorMessage, Field } from "formik";

type InputProps = {
  as?: React.ElementType;
  label?: string;
  inputProps?: React.ComponentProps<"input">;
};

export default function Input({ label, inputProps, as = Field }: InputProps) {
  const As = as;

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-base first-letter:uppercase">{label}</label>
      )}
      <As
        {...inputProps}
        className={clsx(
          "border border-black/50 bg-transparent px-2 py-3 rounded placeholder-black/75 placeholder-capitalize focus:border-secondary focus:ring-3 focus:ring-offset-1 focus:ring-primary/50 dark:border-dark-50 dark:placeholder-text-white/75",
          inputProps?.className
        )}
      />
      {inputProps && inputProps.name && (
        <ErrorMessage
          component="small"
          className="text-red-500 text-xs first-letter:uppercase md:text-sm"
          name={inputProps.name}
        />
      )}
    </div>
  );
}
