import clsx from "clsx";
import { MdExpandMore, MdFilterAlt, MdSearch } from "react-icons/md";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

import { timeFilters } from "../../utils/filters";
import { useDebounce } from "react-use";
import { useState } from "react";

export type Filter = {
  search?: string | null;
  timeFilter?: (typeof timeFilters)[number] | null;
};

type NewTokenFilterProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export default function NewTokenFilter({
  filter,
  setFilter,
}: NewTokenFilterProps) {
  const [search, setSearch] = useState<string | null>(null);

  const setFilterValue =
    <K extends keyof Filter>(name: K) =>
    (value: Filter[K]) => {
      setFilter({ ...filter, [name]: value });
    };

  useDebounce(
    () => {
      setFilterValue("search")(search);
    },
    500,
    [search]
  );

  return (
    <div className="flex items-center px-4">
      <div className="flex-1 flex">
        {/* <div className="btn btn-outline-primary">
          <MdFilterAlt />
          <span>Filters</span>
        </div> */}
      </div>
      <div className="flex items-center space-x-2">
        <Listbox
          as="div"
          className="relative "
          value={filter.timeFilter}
          onChange={setFilterValue("timeFilter")}
        >
          <ListboxButton className="btn !btn-outline-primary">
            <span>{filter.timeFilter ?? "Time"}</span>
            <MdExpandMore />
          </ListboxButton>
          <ListboxOptions className="absolute flex flex-col space-y-2 mt-2 p-2 bg-white border border-black/1 shadow rounded-md z-20 dark:bg-dark">
            {timeFilters.map((filter, index) => (
              <ListboxOption
                key={index}
                value={filter}
              >
                {({ selected }) => (
                  <div
                    className={clsx(
                      "px-4 py-1 rounded-md cursor-pointer hover:bg-black/5  dark:hover:bg-dark-100",
                      selected ? "bg-black/5 dark:bg-dark-100" : ""
                    )}
                  >
                    {filter}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
        <div className="group flex items-center px-2 rounded border border-black/40 focus-within:border-black dark:border-dark-50 dark:focus-within:border-white">
          <MdSearch className="text-xl text-black/75 group-focus-within:text-black dark:text-white/50 dark:group-focus-within:text-white" />
          <input
            placeholder="Filter tokens"
            className="bg-transparent p-2 placeholder-text-black/75 dark:placeholder-text-white/50"
            onChange={(event) => {
              const value = event.target.value;
              if (value.trim().length > 0) setSearch(value);
              else setSearch(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
