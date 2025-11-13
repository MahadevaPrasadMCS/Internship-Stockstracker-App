import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";
import "./index.css";

// 🟦 Currency Context
import { CurrencyProvider } from "./context/CurrencyProvider";

// ⚡ Query Client Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

const root = createRoot(document.getElementById("root"));

// 🌟 Wrapped entire app with CurrencyProvider (important)
root.render(
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CurrencyProvider>

    {/* Devtools only visible in development */}
    {import.meta.env.MODE === "development" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);
