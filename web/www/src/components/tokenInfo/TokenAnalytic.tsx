import clsx from "clsx";
import { Fragment } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

import { timeFilters } from "../../utils/filters";

import ProgressBar from "../ProgressBar";

type TokenAnalyticProps = {
  className?: string;
};

export default function TokenAnalytic({ className }: TokenAnalyticProps) {
  return (
    <TabGroup
      className={clsx(
        className,
        "flex flex-col border rounded-md dark:border-dark-50"
      )}
    >
      <TabList className="flex divide-x border-b dark:border-dark-50 dark:divide-dark-50">
        {timeFilters.map((timeFilter, index) => (
          <Tab
            key={index}
            as={Fragment}
          >
            {({ selected }) => (
              <button
                className={clsx(
                  "flex-1 px-4 py-2",
                  selected ? "bg-black/5" : undefined
                )}
              >
                {timeFilter}
              </button>
            )}
          </Tab>
        ))}
      </TabList>
      <TabPanels as={Fragment}>
        {timeFilters.map((_timeFilter, index) => (
          <TabPanel
            key={index}
            as={Fragment}
          >
            <TokenAnalyticTab />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

const TokenAnalyticTab = () => {
  return (
    <div className="flex-1 flex px-4 divide-x dark:divide-dark-50">
      <div className="flex flex-col">
        <div className="flex-1 flex flex-col p-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Volume
          </p>
          <p className="font-mono">$1.13k</p>
        </div>
        <div className="flex-1 flex flex-col p-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Tnx
          </p>
          <p className="font-mono">16.0</p>
        </div>
        <div className="flex-1 flex flex-col p-2">
          <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
            Traders
          </p>
          <p className="font-mono">8.00</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col p-2">
          <div className="flex-1 flex">
            <div className="flex-1">
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                Buy Volume
              </p>
              <p className="font-mono">$568</p>
            </div>
            <div className="text-end">
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                Sell Volume
              </p>
              <p className="font-mono">$566</p>
            </div>
          </div>
          <ProgressBar values={[0.5, 0.5]} />
        </div>
        <div className="flex flex-col p-2">
          <div className="flex-1 flex">
            <div className="flex-1">
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                Buys
              </p>
              <p className="font-mono">9</p>
            </div>
            <div className="text-end">
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                Sells
              </p>
              <p className="font-mono">7</p>
            </div>
          </div>
          <ProgressBar values={[0.6, 0.4]} />
        </div>
        <div className="flex flex-col p-2">
          <div className="flex-1 flex">
            <div className="flex-1">
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                Buyers
              </p>
              <p className="font-mono">8</p>
            </div>
            <div className="text-end">
              <p className="text-xs text-black/75 md:text-sm dark:text-white/75">
                Sellers
              </p>
              <p className="font-mono">7</p>
            </div>
          </div>
          <ProgressBar values={[0.8, 0.2]} />
        </div>
      </div>
    </div>
  );
};
