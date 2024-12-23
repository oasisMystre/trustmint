import { useMemo } from "react";
import { MdOutlineWallet } from "react-icons/md";
import { useBalance, useReadContract } from "wagmi";
import { Field, useFormikContext, ErrorMessage } from "formik";

import Avatar from "./Avatar";
import abi from "../web3/abi";

type TokenAmountInput = {
  name: string;
  currency: {
    isNative: boolean;
    tokenAddress?: string;
    name?: string | undefined;
    ticker?: string | undefined;
    logo?: string | undefined;
  };
  showBalance?: boolean;
  showPercentage?: boolean;
};

export default function TokenAmountInput({
  name,
  currency,
  showBalance,
  showPercentage,
}: TokenAmountInput) {
  const { setFieldValue } = useFormikContext();

  const data = currency.isNative
    ? useBalance().data
    : useReadContract({
        abi,
        functionName: "getBalance",
        args: [currency.tokenAddress as `0x${string}`],
      }).data;

  const balance = useMemo(
    () =>
      data
        ? typeof data === "bigint"
          ? Number(data / BigInt(Math.pow(10, 18)))
          : Number(data.value) / Number(Math.pow(10, data.decimals))
        : 0,
    [data]
  );

  return (
    <div className="flex flex-col space-y-2">
      {showBalance && (
        <div className="self-end flex items-center space-x-2">
          <span>{balance}</span>
          <MdOutlineWallet className="text-black/50 dark:text-white/50" />
        </div>
      )}
      <div className="flex items-center space-x-2 border px-2 rounded-md focus-within:border-black dark:border-dark-50 dark:bg-dark dark:focus-within:border-white">
        <div>
          <Avatar
            src={currency.logo}
            width={32}
            height={32}
            alt={currency.name ?? "Unknown Token"}
            className="rounded-full"
          />
        </div>
        <Field
          name={name}
          placeholder="0.0"
          type="number"
          className="flex-1 p-3 text-end bg-transparent placeholder-text-black/75 dark:placeholder-text-white/75"
        />
      </div>
      {showPercentage && (
        <div className="flex items-center space-x-2">
          {[10, 25, 50, 75, 100].map((percentage, index) => (
            <button
              key={index}
              type="button"
              className="font-mono text-xs md:text-sm border bg-black/5 text-black/75 px-4 py-0.5 rounded hover:border-black dark:bg-dark dark:border-dark-50 dark:text-white/75 dark:hover:border-white dark:hover:text-white"
              onClick={() => setFieldValue(name, balance / percentage)}
            >
              {percentage}
              <span className="font-sans">%</span>
            </button>
          ))}
        </div>
      )}
      <ErrorMessage name={name} />
    </div>
  );
}
