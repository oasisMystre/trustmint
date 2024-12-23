import { useMemo, useState } from "react";
import { useChains, useWriteContract } from "wagmi";
import { Form, Formik } from "formik";

import abi from "../../web3/abi";
import { Contract } from "../../web3/contracts";
import type { Token } from "../../../.graphclient";
import TokenAmountInput from "../TokenAmountInput";
import TransactionConfirmationToast from "../TransactionConfirmationToast";
import CalculateAmountOut from "../CalculateAmountOut";
import { BN } from "../../web3/number";

type BuyTabProps = {
  token: Pick<Token, "name" | "ticker" | "image" | "tokenAddress">;
};

export default function BuyTab({ token }: BuyTabProps) {
  const [chain] = useChains();
  const contract = useMemo(
    () => Contract[chain.id as keyof typeof Contract],
    [chain]
  );
  const { writeContractAsync } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  return (
    <>
      <Formik
        initialValues={{ buyAmount: "" }}
        onSubmit={async (values) => {
          const decimals = chain.nativeCurrency.decimals;

          const hash = await writeContractAsync({
            abi,
            address: contract.address,
            args: [token.tokenAddress],
            functionName: "buyTokens",
            value: BN.toBigInt(
              new BN(values.buyAmount, decimals).mul(
                new BN(Math.pow(10, decimals))
              ),
              decimals
            ),
          });

          setHash(hash);
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <TokenAmountInput
                name="buyAmount"
                currency={{
                  isNative: true,
                  name: chain.nativeCurrency.name,
                  ticker: chain.nativeCurrency.symbol,
                  logo: contract.currency.logo,
                }}
                showBalance
                showPercentage
              />
              <CalculateAmountOut
                token={{ ...token, decimals: 18 }}
                amountIn={values.buyAmount}
                decimals={chain.nativeCurrency.decimals}
              />
            </div>
            <button
              type="submit"
              disabled={
                isSubmitting || Number.isNaN(parseFloat(values.buyAmount))
                  ? true
                  : parseFloat(values.buyAmount) <= 0
              }
              className="btn bg-green-500 py-3 text-white rounded dark:bg-green dark:text-black"
            >
              Quick Buy
            </button>
          </Form>
        )}
      </Formik>
      {hash && (
        <TransactionConfirmationToast
          hash={hash}
          onSuccess={(_) => {
            /// Todo
          }}
        />
      )}
    </>
  );
}
