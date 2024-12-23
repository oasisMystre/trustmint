import { useEffect, useRef } from "react";
import {
  type IChartingLibraryWidget,
  type LanguageCode,
  widget as Widget,
  type ResolutionString,
} from "@tradeview/chart";

import { getBars } from "../mock/chart.data";
import {
  execute,
  Token,
  TokensDocument,
  TokensQuery,
} from "../../.graphclient";

type ChartViewProps = {
  width: number;
  height: number;
  locale?: LanguageCode;
  className?: string;
  token: Pick<Token, "tokenAddress">;
};

export default function ChartView({
  width,
  height,
  token,
  className,
  locale = "en",
}: ChartViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<IChartingLibraryWidget | null>(null);

  useEffect(() => {
    if (container.current) {
      widget.current = new Widget({
        width,
        height,
        locale,
        theme: "dark",
        debug: true,
        symbol: token.tokenAddress,
        container: container.current,
        library_path: "/charting_library/",
        interval: "5" as ResolutionString,
        datafeed: {
          async onReady(callback) {
            setTimeout(() =>
              callback({
                supports_time: true,
                supports_timescale_marks: true,
                supports_marks: true,
                supported_resolutions: ["1", "15", "30"] as ResolutionString[],
              })
            );
          },
          searchSymbols(userInput, _, __, onResult) {
            return execute(TokensDocument, {
              where: {
                or: [
                  {
                    tokenAddress_contains: userInput,
                    name_contains: userInput,
                    ticker_contains: userInput,
                  },
                ],
              },
            }).then(({ data }) => {
              const { tokens } = data as TokensQuery;
              onResult(
                tokens.map((token) => ({
                  exchange: "MintLab",
                  type: "Crypto",
                  exchange_logo: "/favicon.ico",
                  symbol: token.tokenAddress as string,
                  full_name: token.name as string,
                  description: token.description as string,
                  ticker: token.ticker as string,
                  logo_urls: [token.image as string],
                }))
              );
            });
          },
          async resolveSymbol(symbolName, onResolve, onError) {
            return execute(TokensDocument, {
              where: { tokenAddress: symbolName },
              limit: 1,
            })
              .then(({ data }) => {
                const {
                  tokens: [token],
                } = data as TokensQuery;

                return onResolve({
                  name: token.name as string,
                  ticker: token.ticker as string,
                  description: token.description as string,
                  logo_urls: [token.image as string],
                  unit_id: token.tokenAddress,
                  type: "Crypto",
                  session: "24x7",
                  exchange: "MintLab",
                  listed_exchange: "MintLab",
                  timezone: "Etc/UTC",
                  format: "price",
                  pricescale: Math.pow(10, 18),
                  minmov: 1 / Math.pow(10, 18),
                  visible_plots_set: "ohlc",
                  data_status: "streaming",
                  has_intraday: true,
                });
              })
              .catch(onError);
          },
          getBars(symbolInfo, resolution, periodParams, onResult, onError) {
            const from = periodParams.from * 1000;
            const to = periodParams.to * 1000;

            return getBars({
              to,
              from,
              limit: 0,
              resolution,
              tokenAddress: symbolInfo.unit_id!,
            })
              .then((data) => {
                if (data.length === 0) onResult(data, { noData: true });
                onResult(data);
              })
              .catch(onError);
          },
          subscribeBars() {},
          unsubscribeBars() {},
        },
        enabled_features: ["seconds_resolution", "tick_resolution"],
      });
    }

    return () => widget.current?.remove();
  }, [container, width, height]);

  return (
    <div
      ref={container}
      className={className}
    />
  );
}
