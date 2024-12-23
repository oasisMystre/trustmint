import moment from "moment";

export const timeFilters = ["5m", "1h", "6h", "24h"] as const;

export const timeFilterToDate = (value: (typeof timeFilters)[number]) => {
  switch (value) {
    case "5m":
      return moment().subtract(5, "minutes").valueOf();
    case "1h":
      return moment().subtract(1, "hour").valueOf();
    case "6h":
      return moment().subtract(6, "hours").valueOf();
    case "24h":
      return moment().subtract(24, "hours").valueOf();
  }
};
