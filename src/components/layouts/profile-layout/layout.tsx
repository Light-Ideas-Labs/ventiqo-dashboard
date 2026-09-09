"use client";

import React, { useRef, useState, useEffect, createContext } from "react";
import { cn } from "@/lib/utils";
import Header from "./Header";
import Body from "./Body";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  fixed?: boolean;
}

const LayoutContext = createContext<{
  offset: number;
  fixed: boolean;
} | null>(null);

const Layout: React.FC<LayoutProps> = ({ className, fixed = false, ...props }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const onScroll = () => setOffset(div.scrollTop);
    div.addEventListener("scroll", onScroll, { passive: true });

    return () => div.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LayoutContext.Provider value={{ offset, fixed }}>
      <div
        ref={divRef}
        data-layout="layout"
        className={cn("h-full overflow-auto", fixed && "flex flex-col", className)}
        {...props}
      />
    </LayoutContext.Provider>
  );
};

export { Layout, LayoutContext };
