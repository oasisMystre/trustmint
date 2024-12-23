import { createConfig, webSocket } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { bsc, bscTestnet, baseSepolia, base } from "wagmi/chains";

import { getEnv } from "./utils/env";

const config = createConfig(
  getDefaultConfig({
    chains: [base, bsc, bscTestnet, baseSepolia],
    transports: {
      [base.id]: webSocket(getEnv("INFURA_BASE_ENDPOINT")),
      [bsc.id]: webSocket(getEnv("INFURA_BSC_ENDPOINT")),
      [baseSepolia.id]: webSocket(getEnv("INFURA_BASE_SEPOLIA_ENDPOINT")),
      [bscTestnet.id]: webSocket(getEnv("INFURA_BSC_SEPOLIA_ENDPOINT")),
    },
    appUrl: "",
    appName: "",
    appIcon: "",
    walletConnectProjectId: getEnv("WALLETCONNECT_PROJECT_ID")!,
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export default config;
