"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasClientAuthSession } from "@/lib/auth/client";
import { AUTH_STORAGE_EVENT } from "@/lib/auth/constants";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const enforceAuth = () => {
      const authorized = hasClientAuthSession();
      setIsAuthorized(authorized);
      setIsChecked(true);

      if (!authorized) {
        router.replace("/login");
      }
    };

    enforceAuth();
    window.addEventListener("pageshow", enforceAuth);
    window.addEventListener("storage", enforceAuth);
    window.addEventListener(AUTH_STORAGE_EVENT, enforceAuth);

    return () => {
      window.removeEventListener("pageshow", enforceAuth);
      window.removeEventListener("storage", enforceAuth);
      window.removeEventListener(AUTH_STORAGE_EVENT, enforceAuth);
    };
  }, [router]);

  if (!isChecked || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
