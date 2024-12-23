import { useMemo, useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { useDomRef, useSize } from "../../composables";
import Trade from "../../components/trade";
import ChartView from "../../components/ChartView";
import TokenInfo from "../../components/tokenInfo";
import HolderTnxTab from "../../components/tokenInfo/HolderTnxTab";
import {
  execute,
  TokensDocument,
  type TokensQuery,
} from "../../../.graphclient";

export default function TokenInfoPage() {
  const params = useParams();

  const { data } = useQuery({
    queryKey: [params.chainId, params.tokenAddress],
    queryFn: () =>
      execute(TokensDocument, {
        first: 1,
        where: { tokenAddress: params.tokenAddress },
      }).then(({ data }) => data as TokensQuery),
  });

  const token = useMemo(() => data?.tokens[0], [data]);

  const  [chartContainerEl, setchartContainerEl] = useDomRef<HTMLDivElement>();
  const [chartWidth, chartHeight] = useSize(chartContainerEl);


  return (
    token && (
      <main className="flex-1 pb-4 lt-sm:flex lt-sm:flex-col lt-sm:space-y-4 sm:grid sm:grid-cols-2 xl:flex">
        <TokenInfo
          token={token}
          className="sm:order-first sm:border-r dark:sm:border-dark-50 md:min-w-sm"
        />
        <div className="flex-1 flex flex-col lt-sm:px-4  sm:min-h-xl sm:order-last sm:col-span-2">
          <div
            ref={setchartContainerEl}
            className="flex-1 bg-black/5 dark:bg-dark rounded"
          >
            <ChartView
              width={chartWidth}
              height={chartHeight}
              token={token}
            />
          </div>
          <HolderTnxTab token={token} />
        </div>
        <Trade
          token={token}
          className="xl:border-l xl:order-last dark:sm:border-dark-50"
        />
      </main>
    )
  );
}
