import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import CoinHeld from "./CoinHeld";
import CoinCreated from "./CoinCreated";
import clsx from "clsx";

const tabs = [
  {
    name: "Coins Held",
    component: <CoinHeld />,
  },
  {
    name: "Coins Created",
    component: <CoinCreated />,
  },
];

export default function ProfileTab() {
  return (
    <TabGroup>
      <TabList className="flex space-x-2">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            as={Fragment}
          >
            {({ selected, hover }) => (
              <button
                className={clsx(
                  "px-2 py-1 rounded-md",
                  selected
                    ? "bg-primary text-white dark:bg-primary/75"
                    : "text-black/75 dark:text-white/75",
                  !selected && hover ? "hover:bg-primary/25 hover:text-white hover:dark:bg-primary/10" : ""
                )}
              >
                {tab.name}
              </button>
            )}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={index}>{tab.component}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
