"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/lib/store";
import { authApi } from "@/lib/services/authApi";

type ProvidersProps = {
  children: ReactNode;
};

type StoreBundle = {
  apiSlice: typeof authApi;
  store: AppStore;
};

export default function Providers({ children }: ProvidersProps) {
  const bundleRef = useRef<StoreBundle | null>(null);

  // In development, Fast Refresh can preserve this component while the RTK Query
  // API slice module is replaced. Rebuild the store when that happens so the
  // reducer and middleware stay aligned with the latest endpoint definitions.
  if (!bundleRef.current || bundleRef.current.apiSlice !== authApi) {
    bundleRef.current = {
      apiSlice: authApi,
      store: makeStore(),
    };
  }

  return <Provider store={bundleRef.current.store}>{children}</Provider>;
}
