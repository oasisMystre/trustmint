import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

import Header from "./Header";

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer
        position="bottom-right"
        className="z-9999"
      />
    </>
  );
}
