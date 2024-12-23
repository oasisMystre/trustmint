"use client";

import clsx from "clsx";
import { useClickAway } from "react-use";
import { Fragment, useRef, useState } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

import BuyTab from "./BuyTab";
import SellTab from "./SellTab";
import type { Token } from "../../../.graphclient";

export const tradeTabs = [
  { name: "Buy", component: BuyTab },
  { name: "Sell", component: SellTab },
];

type TradeTabrops = {
  className?: string;
  isMobileModal?: boolean;
  token: Pick<Token, "name" | "ticker" | "image" | "tokenAddress">;
};

export default function Trade({
  token,
  className,
  isMobileModal = true,
}: TradeTabrops) {
  const panelEl = useRef<HTMLElement | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useClickAway(panelEl, () => setIsPanelVisible(false));

  return (
    <TabGroup
      ref={panelEl}
      className={clsx(
        className,
        "relative flex flex-col space-y-4 min-w-xs px-4",
        isMobileModal
          ? "lt-sm:sticky lt-sm:bottom-0 lt-sm:inset-x-0 lt-sm:bg-white lt-sm:py-4 dark:lt-sm:bg-dark-900"
          : undefined
      )}
    >
      <TabList className="flex bg-black/5 text-black/75 rounded-md border dark:border-dark dark:bg-dark-700 dark:text-white/75">
        {tradeTabs.map((tradeTab, index) => (
          <Tab
            key={index}
            as={Fragment}
          >
            {({ selected }) => (
              <button
                className={clsx(
                  "flex-1 px-4 py-2 border",
                  selected
                    ? clsx(
                        "text-black rounded-md dark:text-white",
                        index % 2 === 0
                          ? " border-green-500 bg-green/10"
                          : "border-red-500 bg-red/10"
                      )
                    : "border-transparent"
                )}
                onClick={() => setIsPanelVisible(true)}
              >
                {tradeTab.name}
              </button>
            )}
          </Tab>
        ))}
      </TabList>
      <TabPanels
        className={clsx(
          isMobileModal
            ? isPanelVisible
              ? "lt-sm:absolute lt-sm:-top-64 lt-sm:inset-x-0 lt-sm:flex lt-sm:flex-col lt-sm:space-y-4 lt-sm:bg-white lt-sm:p-4 lt-sm:pb-0  lt-sm:border-t dark:lt-sm:bg-dark-900 dark:lt-sm:border-t-dark-50"
              : "lt-sm:hidden"
            : undefined
        )}
      >
        {tradeTabs.map((tradeTab, index) => (
          <TabPanel key={index}>
            <tradeTab.component token={token} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
