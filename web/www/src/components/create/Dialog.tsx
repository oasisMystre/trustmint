import clsx from "clsx";
import { Fragment } from "react";
import { MdClose } from "react-icons/md";
import { TabGroup, Tab, TabList, TabPanels, TabPanel } from "@headlessui/react";

import PaneDialog from "../PaneDialog";
import MetadataTab from "./MetadataTab";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const createFormSteps = [{ name: "Token Metadata", component: MetadataTab }];

export default function CreateDialog({ open, setOpen }: Props) {
  const onClose = () => setOpen(false);

  return (
    <PaneDialog
      dialogProps={{ open, onClose }}
      panelProps={{ className: "flex flex-col px-2 space-y-2 md:space-y-4" }}
    >
      <header className="flex items-center space-x-4 py-2">
        <button
          className="p-2"
          onClick={onClose}
        >
          <MdClose className="text-xl" />
        </button>
        <div className="text-lg">Create New Token</div>
      </header>
      <TabGroup className="flex-1 flex flex-col space-y-8 px-2">
        <TabList className="flex items-center space-x-1">
          {createFormSteps.map((step, index) => (
            <Fragment key={index}>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button className="flex items-center space-x-2">
                    <div
                      className={clsx(
                        "shrink-0 size-8 flex items-center justify-center rounded-full",
                        selected
                          ? "bg-primary text-white"
                          : "bg-primary/5 text-black dark:bg-primary/25 dark:text-white"
                      )}
                    >
                      {index + 1}
                    </div>
                    <p>{step.name}</p>
                  </button>
                )}
              </Tab>
              {index < createFormSteps.length - 1 && (
                <div className="flex-1 h-0.5 px-4 bg-black dark:bg-white" />
              )}
            </Fragment>
          ))}
        </TabList>
        <TabPanels as={Fragment}>
          {createFormSteps.map((step, index) => {
            return (
              <TabPanel
                key={index}
                as={Fragment}
              >
                <step.component
                  key={index}
                  onClose={onClose}
                />
              </TabPanel>
            );
          })}
        </TabPanels>
      </TabGroup>
    </PaneDialog>
  );
}
