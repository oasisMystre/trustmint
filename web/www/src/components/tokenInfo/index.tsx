import moment from "moment";
import clsx from "clsx";
import { useChains } from "connectkit";
import { MdContentCopy } from "react-icons/md";

import type { TokensQuery } from "../../../.graphclient";

import Avatar from "../Avatar";
import TokenSocial from "./Social";
import CurveInfo from "./CurveInfo";
import TokenAnalytic from "./TokenAnalytic";

type TokenInfoProps = {
  className?: string;
  token: TokensQuery["tokens"][number];
};

export default function TokenInfo({ className, token }: TokenInfoProps) {
  const [chain] = useChains();

  return (
    <div className={clsx(className, "flex flex-col px-4")}>
      <div className="flex items-center space-x-2">
        <Avatar
          alt={token.name as string}
          src={token.image as string}
          width={32}
          height={32}
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-medium">{token.name}</h1>
          <div className="flex items-center space-x-2">
            {token.description && (
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                {token.description}
              </p>
            )}
          </div>
          <div className="flex space-x-4 text-xs text-black/75 md:text-sm dark:text-white/75">
            <div className="flex items-center space-x-2">
              <span>{token.tokenAddress}</span>
              <MdContentCopy />
            </div>
            <TokenSocial token={token} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex flex-col py-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Price USD
          </p>
          <p className="font-mono">
            {(token.price / Math.pow(10, chain.nativeCurrency.decimals)).toFixed(8)}
          </p>
        </div>
        <div className="flex flex-col py-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Price {chain.nativeCurrency.symbol}
          </p>
          <p className="font-mono">
            {(token.price /
              Math.pow(10, chain.nativeCurrency.decimals)).toFixed(8)}&nbsp;
            {chain.nativeCurrency.symbol}
          </p>
        </div>
        <div className="flex flex-col py-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Age
          </p>
          <p>{moment.unix(token.createdAt).fromNow()}</p>
        </div>
        <div className="flex flex-col py-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Market Cap
          </p>
          <p className=" font-mono">
            {(token.tokensSold / Math.pow(10, 18)).toFixed(8)}
          </p>
        </div>
        <div className="flex flex-col py-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            FDV
          </p>
          <p className="font-mono">0.56417</p>
        </div>
        <div className="flex flex-col py-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Liquidity
          </p>
          <p className="font-mono">
            {(token.tokensSold / Math.pow(10, 18)).toFixed(8)}
          </p>
        </div>
      </div>
      <TokenAnalytic />
      <CurveInfo />
    </div>
  );
}
