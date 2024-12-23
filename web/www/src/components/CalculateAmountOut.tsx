import { Token } from "../../.graphclient";
import { useReadContract } from "wagmi";
import { useContract } from "../providers/ContractProvider";
import { BN } from "../web3/number";
import { useMemo } from "react";

type CalculateAmountOutProps = {
  amountIn: string;
  decimals: number;
  token: Pick<Token, "tokenAddress" | "ticker"> & { decimals: number };
};

export default function CalculateAmountOut({
  amountIn,
  decimals,
  token,
}: CalculateAmountOutProps) {
  if (Number(amountIn) > 0) {
    const { contract, abi } = useContract();
    const amount = useMemo(
      () =>
        BN.toBigInt(
          new BN(amountIn, decimals).mul(new BN(Math.pow(10, decimals))),
          decimals
        ),
      [amountIn]
    );
    const { data, isLoading, error } = useReadContract({
      abi,
      address: contract.address,
      functionName: "getAmount",
      args: [token.tokenAddress, amount],
    });

    console.log(error, data, amount);

    return isLoading ? (
      <div className="flex space-x-2">
        <div className="w-16 h-2.5 bg-white rounded-sm animate-pulse dark:bg-dark-50" />
        <div className="w-8 h-2.5 bg-white rounded-sm animate-pulse dark:bg-dark-50" />
      </div>
    ) : data ? (
      <div className="flex items-center text-xs">
        <span>{Number(data / BigInt(Math.pow(10, token.decimals)))}</span>
        <span>{token.ticker}</span>
      </div>
    ) : (
      <span className="text-xs text-white/50">Fetching price error</span>
    );
  }
  return <></>;
}
