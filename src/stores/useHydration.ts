"use client";

import { useEffect, useState } from "react";
import { useGroupStore } from "./groupStore";

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // クライアントサイドでストアをhydrate
    useGroupStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return hydrated;
}
