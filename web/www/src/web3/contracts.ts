import { bsc, bscTestnet, baseSepolia, base } from "wagmi/chains";

export const Contract = {
  [base.id]: {
    explorer: "https://basescan.org/",
    address: "0xC5315BB0B13C7859074c9Cc820647a77C1753DC8",
    currency: {
      logo: "/base.png",
    },
  },
  [bsc.id]: {
    explorer: "https://bscscan.com/",
    address: "0xC5315BB0B13C7859074c9Cc820647a77C1753DC8",
    currency: {
      logo: "/bsc.png",
    },
  },
  [baseSepolia.id]: {
    explorer: "https://basescan.org/",
    address: "0xC5315BB0B13C7859074c9Cc820647a77C1753DC8",
    currency: {
      logo: "/base.png",
    },
  },
  [bscTestnet.id]: {
    explorer: "https://bscscan.com/",
    address: "0xC5315BB0B13C7859074c9Cc820647a77C1753DC8",
    currency: {
      logo: "/bsc.png",
    },
  },
} as const;
