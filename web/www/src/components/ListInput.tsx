import { FieldArray, useFormikContext } from "formik";

import Input from "./Input";
import { format } from "../utils/format";

type ListInputProps = {
  label: string;
  name: string;
  addActionProps?: {
    text: string;
  };
};

export default function ListInput({ label, name }: ListInputProps) {
  const { values } = useFormikContext<{ [key: string]: { name: string }[] }>();

  return (
    <FieldArray
      name={name}
      render={() => {
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center relative">
              <label className="flex-1 text-lg">{label}</label>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                {values[name].map((value, index) => {
                  const fieldName = format("%.%.%", name, index, "value");

                  return (
                    <Input
                      key={index}
                      label={value.name}
                      inputProps={{
                        placeholder: format("% Link", value.name),
                        name: fieldName,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
