import { useMemo, useState } from "react";
import { useChains, useWriteContract } from "wagmi";
import { Form, Formik } from "formik";
import { number, object } from "yup";

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

export default function SellTab({ token }: BuyTabProps) {
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
        initialValues={{ sellAmount: "" }}
        validateSchema={object({
          sellAmount: number().min(0).required(),
        })}
        onSubmit={async (values) => {
                 const decimals = 18;
       
                 const hash = await writeContractAsync({
                   abi,
                   address: contract.address,
                   args: [token.tokenAddress],
                   functionName: "buyTokens",
                   value: BN.toBigInt(
                     new BN(values.sellAmount, decimals).mul(
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
                name="sellAmount"
                currency={{
                  isNative: true,
                  name: token.name!,
                  ticker: token.ticker!,
                  logo: token.image!,
                }}
                showBalance
                showPercentage
              />
              <CalculateAmountOut
                token={{...token, decimals: chain.nativeCurrency.decimals}}
                decimals={18}
                amountIn={values.sellAmount}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-red-500 py-3 text-white rounded dark:bg-red dark:text-black"
            >
              Quick Sell
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
