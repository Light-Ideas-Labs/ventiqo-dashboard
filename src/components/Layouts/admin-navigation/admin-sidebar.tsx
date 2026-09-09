"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { IconChevronsLeft } from "@tabler/icons-react";

import { AdminSidebarDashboardNav } from "@/components/layouts/admin-navigation/admin-sidebar-dashboard-nav";
import { useSidebar } from "@/hooks/useSidebar";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { handleLogout } from "@/utils/logout";

type SidebarProps = {
  className?: string;
};

export default function AdminSidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };
  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? "w-60" : "w-[72px]",
        className,
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link href="/">
          <Image
            src={"/images/logo/ventiqo-white-logo.svg"}
            alt="Ventiqo Logo"
            width={40}
            height={40}
            className="brightness-0 filter"
          />
        </Link>
      </div>
      <IconChevronsLeft
        className={cn(
          "absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180",
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <AdminSidebarDashboardNav items={navItems.map((item) => {
                if (item.label === "signout") {
                  return {
                    ...item,
                    onClick: handleLogout, // Use the handleLogout function
                    href: "#", // Disable default link behavior for logout
                  };
                }
                return item;
              })} />
          </div>
        </div>
      </div>
    </aside>
  );
}
