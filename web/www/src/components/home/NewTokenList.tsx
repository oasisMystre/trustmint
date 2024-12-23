import moment from "moment";

import { useMemo } from "react";
import { Link } from "react-router";
import { MdWeb } from "react-icons/md";
import { useChains } from "wagmi";
import { InView } from "react-intersection-observer";
import { FaTelegram, FaTwitter } from "react-icons/fa";

import Avatar from "../Avatar";
import { format } from "../../utils/format";
import type { Token_orderBy, TokensQuery } from "../../../.graphclient";

import ShimNewTokenItem from "./ShimNewTokenItem";
import TableColumn from "../TableColum";

type NewTokenListProps = {
  orderBy: Token_orderBy;
  setOrderBy: React.Dispatch<React.SetStateAction<Token_orderBy>>;
  data?: TokensQuery[];
  fetchNextPage: () => Promise<void>;
};

export default function NewTokenList({
  data,
  orderBy,
  setOrderBy,
  fetchNextPage,
}: NewTokenListProps) {
  const [chain] = useChains();
  const group = useMemo(() => data?.flatMap((group) => group.tokens), [data]);

  const tableColumns: { name: string; value: Token_orderBy }[] = [
    {
      name: "Token/Age",
      value: "createdAt",
    },
    {
      name: "Price",
      value: "price",
    },
    {
      name: "MarketCap",
      value: "balance",
    },
    {
      name: "Last trade",
      value: "lastTrade",
    },
  ];

  return (
    <div className="flex-1 w-screen overflow-x-scroll">
      <table className="relative flex-1  overflow-x-scroll lt-md:w-xl md:w-full">
        <thead>
          <tr>
            {tableColumns.map((column, index) => (
              <TableColumn
                key={index}
                className="text-start"
                value={column.value}
                selected={orderBy}
                onSelect={setOrderBy}
              >
                {column.name}
              </TableColumn>
            ))}
          </tr>
        </thead>
        <tbody>
          {group
            ? group.map((token, index) => {
                const child = (
                  <>
                    <td
                      colSpan={1}
                      className="inline-flex items-center space-x-2 border-r dark:border-dark-50"
                    >
                      <Avatar
                        width={32}
                        height={32}
                        src={token.image as string | undefined}
                        alt="-"
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={format(
                              "/%/%/",
                              chain.name.toLowerCase(),
                              token.tokenAddress
                            )}
                            className="text-base font-medium"
                          >
                            ${token.ticker}
                          </Link>
                        </div>
                        <div className="text-black/50 text-xs md:text-sm dark:text-white/50">
                          <p className="font-medium">
                            {moment.unix(token.createdAt).fromNow()}
                          </p>
                          <p className="flex space-x-2">
                            <FaTwitter className="hover:text-white" />
                            <FaTelegram className="hover:text-white" />
                            <MdWeb className="hover:text-white" />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {(
                        token.price /
                        Math.pow(10, chain.nativeCurrency.decimals)
                      ).toFixed(8)}{" "}
                      {chain.nativeCurrency.symbol}
                    </td>
                    <td>
                      {(
                        token.balance /
                        Math.pow(10, chain.nativeCurrency.decimals)
                      ).toFixed(8)}{" "}
                      {chain.nativeCurrency.symbol}
                    </td>
                    <td>
                      <p className="font-medium">
                        {token.lastTrade
                          ? moment.unix(token.lastTrade).fromNow()
                          : "-"}
                      </p>
                    </td>
                  </>
                );

                return index === group.length - 1 ? (
                  <InView
                    as="tr"
                    key={token.tokenAddress}
                    triggerOnce
                    className="border-y dark:border-dark-50"
                    onChange={fetchNextPage}
                  >
                    {child}
                  </InView>
                ) : (
                  <tr
                    key={token.tokenAddress}
                    className="border-y dark:border-dark-50"
                  >
                    {child}
                  </tr>
                );
              })
            : Array.from({ length: 32 }).map((_, index) => (
                <ShimNewTokenItem key={index} />
              ))}
        </tbody>
      </table>
    </div>
  );
}
