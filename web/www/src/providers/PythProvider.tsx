import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PriceFeed,
  PriceServiceConnection,
} from "@pythnetwork/price-service-client";
import { format } from "../utils/format";

type PythContext = {
  getPrice: (priceId: string) => number | undefined;
};

const PythContext = createContext<Partial<PythContext>>({});

type PythProviderProps = {
  endpoint: string;
  priceIds: string[];
};

export default function PythProvider({
  children,
  endpoint,
  priceIds,
}: React.PropsWithChildren<PythProviderProps>) {
  const [prices, setPrices] = useState(new Map<string, number>());
  const connection = useMemo(
    () =>
      new PriceServiceConnection(endpoint, {
        priceFeedRequestConfig: { binary: true },
      }),
    [endpoint]
  );

  const getPrice = useCallback(
    (priceId: string) => prices.get(priceId),
    [prices]
  );

  const updatePrice = (priceFeed: PriceFeed) => {
    const price = priceFeed.getPriceUnchecked();
    setPrices((prices) => {
      prices.set(
        format("0x%", priceFeed.id),
        price.getPriceAsNumberUnchecked()
      );
      return new Map(prices);
    });
  };

  useEffect(() => {
    connection.getLatestPriceFeeds(priceIds).then((priceFeeds) => {
      if (priceFeeds) priceFeeds.map(updatePrice);
    });

    connection.subscribePriceFeedUpdates(priceIds, updatePrice);

    return () => {
      connection.unsubscribePriceFeedUpdates(priceIds, updatePrice);
    };
  }, [priceIds, connection]);

  return (
    <PythContext.Provider value={{ getPrice }}>{children}</PythContext.Provider>
  );
}

export const usePyth = () => useContext(PythContext) as PythContext;
