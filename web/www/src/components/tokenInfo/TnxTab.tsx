import clsx from "clsx";
import moment from "moment";
import { useMemo } from "react";
import { useChains } from "connectkit";
import { useWatchContractEvent } from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  execute,
  Token,
  TokensTransactionsDocument,
  TokensTransactionsQuery,
} from "../../../.graphclient";
import { truncateAddress } from "../../utils/format";
import { useContract } from "../../providers/ContractProvider";

type TnxTabProps = {
  token: Pick<Token, "ticker" | "tokenAddress">;
};

export default function TnxTab({ token }: TnxTabProps) {
  const [chain] = useChains();
  const queryClient = useQueryClient();
  const { abi, contract } = useContract();

  const queryKey = useMemo(
    () => ["transactions", chain.id, token.tokenAddress],
    [chain, token]
  );

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      execute(TokensTransactionsDocument, {
        where: { tokenAddress: token.tokenAddress },
        orderBy: "blockTimestamp",
      }).then(({ data }) => data as TokensTransactionsQuery),
  });

  useWatchContractEvent({
    abi,
    address: contract.address,
    eventName: "TokensTransaction",
    args: {
      tokenAddress: token.tokenAddress,
    },
    onLogs: (logs) => {
      const tnxs = logs.map(({ args, ...props }) => ({
        value: args.value,
        sender: args.sender,
        id: crypto.randomUUID(),
        tokenAddress: args.tokenAddress,
        tokensAmount: args.tokensAmount,
        blockNumber: props.blockNumber,
        blockTimestamp: props.blockNumber,
        transactionHash: props.transactionHash,
        transactionType: args.transactionType,
      }));
      queryClient.setQueryData(queryKey, (data: TokensTransactionsQuery) => ({
        tokensTransaction: [...tnxs, ...data.tokensTransactions],
      }));
    },
    onError: console.error,
  });

  return (
    <div className="flex-1 w-full max-h-xl overflow-scroll">
      <table className="w-full max-h-xl overflow-scroll">
        <thead>
          <tr className="border-y">
            <th>Date</th>
            <th>Price</th>
            <th>Volume</th>
            <th>{token.ticker}</th>
            <th>Trader</th>
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm">
          {data?.tokensTransactions.map((transaction, index) => {
            const isSell = transaction.transactionType === 1;

            return (
              <tr key={index}>
                <td className="inline-flex items-center space-x-2">
                  <div
                    className={clsx(
                      "shrink-0 size-6 flex items-center justify-center  rounded-full",
                      isSell
                        ? "bg-red-500  text-white dark:bg-red dark:text-black"
                        : "bg-green-500  text-white dark:bg-green dark:text-black"
                    )}
                  >
                    {isSell ? "S" : "B"}
                  </div>
                  <span className="shrink-0 text-nowrap text-black/75 dark:text-white/75">
                    {moment.unix(transaction.blockTimestamp).fromNow()}
                  </span>
                </td>
                <td className="font-mono">
                  {(
                    transaction.value /
                    Math.pow(10, chain.nativeCurrency.decimals)
                  ).toFixed(8)}
                  &nbsp;
                  {chain.nativeCurrency.symbol}
                </td>
                <td className="font-mono">
                  {(isSell
                    ? transaction.tokensAmount / Math.pow(10, 18)
                    : transaction.tokensAmount /
                      Math.pow(10, chain.nativeCurrency.decimals)
                  ).toFixed(8)}
                  &nbsp;
                  {isSell ? token.ticker : chain.nativeCurrency.symbol}
                </td>
                <td className="font-mono">
                  {(transaction.tokensAmount / Math.pow(10, 18)).toFixed(8)}
                  &nbsp;
                  {token.ticker}
                </td>
                <td>{truncateAddress(transaction.sender)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
