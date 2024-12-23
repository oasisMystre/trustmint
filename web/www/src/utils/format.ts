export const format = <T extends Array<string | number | object>>(
  delimiter: string,
  ...values: T
) => {
  return String(
    values.reduce(
      (result, value) => String(result).replace(/(%|%d|%s)/, value.toString()),
      delimiter
    )
  );
};

export const truncateAddress = <T extends string>(value: T) =>
  value.slice(0, 3) + "..." + value.slice(value.length - 3);
