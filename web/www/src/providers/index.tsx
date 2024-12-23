import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import config from "../wagmi.config";
import CloudinaryProvider from "./CloudinaryProvider";
import ContractProvider from "./ContractProvider";
import PythProvider from "./PythProvider";

const queryClient = new QueryClient();

type ProviderProps = React.ComponentProps<typeof PythProvider> &
  React.ComponentProps<typeof CloudinaryProvider>;

export default function Provider({
  children,
  cloudName,
  endpoint,
  priceIds,
}: React.PropsWithChildren<ProviderProps>) {
  return (
    <PythProvider
      endpoint={endpoint}
      priceIds={priceIds}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <CloudinaryProvider cloudName={cloudName}>
              <ContractProvider>{children}</ContractProvider>
            </CloudinaryProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PythProvider>
  );
}
