"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/lib/store";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const [store] = useState<AppStore>(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
