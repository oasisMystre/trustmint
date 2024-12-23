"use client";
import clsx from "clsx";
import { Link } from "react-router";
import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useClickAway, useMedia } from "react-use";
import { useFloating } from "@floating-ui/react";
import {
  MdBook,
  MdBubbleChart,
  MdMenu,
  MdQuestionMark,
  MdCategory,
} from "react-icons/md";

import CreateButton from "../create/Button";

const navigations = [
  // { name: "Tokens", path: "/", icon: MdCategory },
  // { name: "Trade", path: "/", icon: MdBubbleChart },
  // { name: "Support", path: "/", icon: MdQuestionMark },
  { name: "Docs", path: "/", icon: MdBook },
];

export default function Header() {
  const { refs } = useFloating();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);
  useClickAway(refs.floating, () => setIsNavOpen(false));

  return (
    <div className="sticky top-0 inset-x-0 z-10 bg-white dark:bg-dark-900">
      <header className="relative flex space-x-4 shadow lt-md:pr-2 md:px-4">
        <Link to="/">
          <img
            src={isDarkMode ? "/logo.jpg" : "/logo.jpg"}
            alt="TrustMint"
            width={128}
            height={128}
            className="object-cover"
          />
        </Link>
        <div className="flex-1 flex items-center">
          <div
            ref={refs.setFloating}
            className={clsx(
              "flex md:items-center md:justify-center md:space-x-2",
              isNavOpen
                ? "lt-md:min-w-1/3 lt-md:absolute lt-md:right-4 lt-md:top-12 lt-md:flex-col lt-md:bg-white lt-md:px-2 lt-md:py-4 lt-md:shadow-xl lt-md:rounded-md lt-md:z-10 dark:lt-md:bg-dark dark:lt-md:text-white"
                : "lt-md:hidden"
            )}
          >
            {navigations.map((navigation, index) => (
              <Link
                key={index}
                to={navigation.path}
                className="flex items-center space-x-2 px-2 py-2 text-black/75 hover:bg-primary/5 hover:rounded-md dark:text-white/75 dark:hover:bg-primary/25"
              >
                <navigation.icon />
                <span>{navigation.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex space-x-2 md:space-x-4 items-center">
          <CreateButton />
          <ConnectKitButton customTheme={{ "--ck-font-family": "Inter" }} />
          <button
            ref={refs.setReference}
            className="md:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <MdMenu className="text-xl" />
          </button>
        </div>
      </header>
    </div>
  );
}
