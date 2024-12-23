import type { ResolutionString } from "@tradeview/chart";

const bars = [
  { low: 0.0001, high: 0.00001, open: 0.2, close: 0.3, time: 1 },
  { low: 0.0001, high: 0.00001, open: 0.2, close: 0.3, time: 1 },
  { low: 0.0001, high: 0.00001, open: 0.2, close: 0.3, time: 1 },
  { low: 0.0001, high: 0.00001, open: 0.2, close: 0.3, time: 1 },
  { low: 0.0001, high: 0.00001, open: 0.2, close: 0.3, time: 1 },
  { low: 0.0001, high: 0.00001, open: 0.2, close: 0.3, time: 1 },
];

type BarArgs = {
  tokenAddress: string;
  from: number;
  to: number;
  limit: number;
  resolution: ResolutionString;
};

export let times = 0;

export const getBars = async (_args: BarArgs) =>{
  if(times === 5) return [];
  times ++;
  return bars;
};
