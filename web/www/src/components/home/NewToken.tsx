import { useMemo, useState } from "react";
import { useWatchContractEvent } from "wagmi";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Token_filter,
  Token_orderBy,
  TokensDocument,
  execute,
  type TokensQuery,
} from "../../../.graphclient";

import NewTokenList from "./NewTokenList";
import NewTokenFilter, { type Filter } from "./NewTokenFilter";
import { timeFilterToDate } from "../../utils/filters";
import { useContract } from "../../providers/ContractProvider";

export default function NewToken() {
  const queryClient = useQueryClient();
  const { abi, contract } = useContract();

  const [orderBy, setOrderBy] = useState<Token_orderBy>("createdAt");
  const [filter, setFilter] = useState<Filter>({
    timeFilter: null,
  } as const);

  const context = useMemo(() => {
    const context: { where: Token_filter; orderBy: Token_orderBy } = {
      where: {},
      orderBy,
    };
    if (filter.search) {
      if (!context.where.or) context.where.or = [];
      context.where.or?.push({ tokenAddress_contains: filter.search });
      context.where.or?.push({ name_contains: filter.search });
      context.where.or?.push({ ticker_contains: filter.search });
    }
    if (filter.timeFilter)
      context.where.createdAt_gte = timeFilterToDate(filter.timeFilter);

    return context;
  }, [filter, orderBy]);

  const queryKey = useMemo(() => ["newTokens", context], [context]);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const first = 50;
      const skip = first * pageParam;
      return execute(TokensDocument, { ...context, first, skip }).then(
        ({ data }) => {
          return data ?? ({ tokens: [] } as TokensQuery);
        }
      );
    },
    getNextPageParam: (lastPage, pages, lastPageParam) =>
      pages.length >= 50 || lastPage.length >= 50 ? lastPageParam + 1 : null,
  });

  console.log(contract.address);

  useWatchContractEvent({
    abi,
    address: contract.address,
    eventName: "AddedToken",
    async onLogs(logs) {
      console.log("logs", logs);

      const tokenAddresses = logs.map((log) => log.args.tokenAddress);

      console.log("token_addresss", tokenAddresses);

      const {
        data: { tokens },
      } = await execute(TokensDocument, {
        where: {
          tokenAddress_in: tokenAddresses,
        },
      });

      console.log("new tokens fetched", tokens);

      queryClient.setQueryData(
        queryKey,
        (data: InfiniteData<TokensQuery[], number>) => {
          data.pages[0].unshift(tokens);

          return {
            pages: data.pages,
            pageparams: data.pageParams,
          };
        }
      );
    },
    onError: console.error,
  });

  return (
    <section className="flex-1 flex flex-col space-y-4">
      <div className="px-4">
        <h1 className="text-xl font-bold">New Tokens</h1>
        <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
          Real-time feed of tokens launched in the past 24h
        </p>
      </div>
      <div className="flex-1 flex flex-col space-y-2">
        <NewTokenFilter
          filter={filter}
          setFilter={setFilter}
        />
        <NewTokenList
          data={data?.pages}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          fetchNextPage={async () => {
            await fetchNextPage();
          }}
        />
      </div>
    </section>
  );
}
