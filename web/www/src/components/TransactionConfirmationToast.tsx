import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
import { MdArrowOutward } from "react-icons/md";
import { type Address, TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt, useChains } from "wagmi";

import { format } from "../utils/format";

type TransactionConfirmationProps = {
  hash: Address;
  onSuccess: (value: TransactionReceipt) => void;
};

export const ToastContent = ({
  explorerUrl,
  message,
  hash,
}: {
  explorerUrl?: string;
  message: string;
  hash: string;
}) => {
  return (
    <div className="flex flex-col text-sm space-y-2">
      <p>{message}</p>
      {
        <a
          href={format("%/tx/%", explorerUrl!, hash)}
          target="_blank"
          className="flex items-center text-xs underline underline-dashed space-x-2"
        >
          <span>View in explorer</span>
          <MdArrowOutward />
        </a>
      }
    </div>
  );
};

export default function TransactionConfirmationToast({
  hash,
  onSuccess,
}: TransactionConfirmationProps) {
  const [chain] = useChains();

  const toastId = useMemo(
    () =>
      toast.loading("Confirming transaction", {
        autoClose: false,
        toastId: hash,
      }),
    [hash]
  );
  const { isLoading, isSuccess, isError, data } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess)
      toast.update(toastId, {
        type: "success",
        isLoading: false,
        render: () => (
          <ToastContent
            message="Transaction successful."
            explorerUrl={chain.blockExplorers?.default.url}
            hash={hash}
          />
        ),
      });
    if (isError)
      toast.update(toastId, {
        type: "error",
        isLoading: false,
        render: () => (
          <ToastContent
            message="Transaction failed."
            hash={hash}
            explorerUrl={chain.blockExplorers?.default.url}
          />
        ),
      });
  }, [isSuccess, isLoading, isError, toastId, hash]);

  useEffect(() => {
    if (data) {
      onSuccess(data);
      return toast.dismiss(toastId);
    }
  }, [data, toastId, onSuccess]);

  return <></>;
}
