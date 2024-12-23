import { useMemo, useRef } from "react";
import { MdImage } from "react-icons/md";
import { ErrorMessage, useFormikContext } from "formik";


type FileInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
};

export default function FileInput({
  name,
  label,
  placeholder,
}: FileInputProps) {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const { values, setFieldValue } = useFormikContext<{ [key: string]: File }>();
  const value = useMemo(() => values[name], [values, name]);
  const preview = useMemo(() => {
    if (value) return URL.createObjectURL(value);
    return null;
  }, [value]);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <label className="text-base">{label}</label>
        <div
          className="flex items-center space-x-2 border border-black/50 rounded p-2 cursor-pointer dark:border-dark-50"
          onClick={() => inputEl.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              width={64}
              height={64}
              alt="Preview"
              className="size-8 rounded border shadow"
            />
          ) : (
            <div className="p-1.5 bg-black/5 shadow rounded dark:bg-white/5">
              <MdImage className="text-xl" />
            </div>
          )}
          <div className="text-black/75 dark:text-white/75">
            {value ? value.name : placeholder ?? "Select File"}
          </div>
        </div>
        <ErrorMessage
          component="small"
          className="text-red-500 text-xs first-letter:uppercase md:text-sm"
          name={name}
        />
      </div>
      <input
        ref={inputEl}
        type="file"
        accept="image/*,video/*"
        hidden
        name={name}
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) setFieldValue(name, files.item(0));
        }}
      />
    </>
  );
}
