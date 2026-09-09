"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/loader";

export default function RootLayoutClient({ children, }: Readonly<{children: React.ReactNode;}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return <>{loading ? <Loader /> : children}</>;
}
