import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

import Provider from "./providers/index.tsx";

import { getEnv } from "./utils/env.ts";

import HomePage from "./pages";
import ProfilePage from "./pages/profile";
import TokenInfoPage from "./pages/tokenInfo";
import RootLayout from "./components/layout";
import { PythPriceId } from "./web3/pyth.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider
      endpoint={getEnv("PYTH_ENDPOINT")}
      priceIds={Object.values(PythPriceId)}
      cloudName={getEnv("CLOUDINARY_CLOUD_NAME")!}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<RootLayout />}
          >
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/:chainId/:tokenAddress"
              element={<TokenInfoPage />}
            />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
