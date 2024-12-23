"use client";

import clsx from "clsx";
import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";

import TnxTab from "./TnxTab";
import HolderTab from "./HolderTab";
import { Token } from "../../../.graphclient";

const tabs = [
  {
    name: "Transactions",
    component: TnxTab,
  },
  {
    name: "Holders",
    component: HolderTab,
  },
];

type HolderTnxTabProps = {
  token: Pick<Token, "tokenAddress">;
};

export default function HolderTnxTab({ token }: HolderTnxTabProps) {
  return (
    <TabGroup className="flex flex-col">
      <TabList className="flex">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            as={Fragment}
          >
            {({ selected }) => (
              <button
                className={clsx(
                  "p-2 border-b-2",
                  selected
                    ? "text-black  border-black dark:text-white dark:border-white"
                    : "text-black/50 border-transparent dark:text-white/50"
                )}
              >
                {tab.name}
              </button>
            )}
          </Tab>
        ))}
      </TabList>
      <TabPanels as={Fragment}>
        {tabs.map((tab, index) => (
          <TabPanel
            key={index}
            as={Fragment}
          >
            <tab.component token={token} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
