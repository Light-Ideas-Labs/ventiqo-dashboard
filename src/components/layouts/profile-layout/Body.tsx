"use client";

import React, { forwardRef, useContext } from "react";
import { cn } from "@/lib/utils";
import { LayoutContext } from "./layout"; // Ensure correct path

const Body = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const contextVal = useContext(LayoutContext);
    if (contextVal === null) {
      throw new Error(`Layout.Body must be used within Layout.`);
    }

    return (
      <div
        ref={ref}
        data-layout="body"
        className={cn(
          "px-4 py-6 md:overflow-hidden md:px-8",
          contextVal.fixed && "flex-1",
          className
        )}
        {...props}
      />
    );
  }
);

Body.displayName = "Body";

export default Body;
