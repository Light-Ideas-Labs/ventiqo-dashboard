"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { IconChevronsLeft } from "@tabler/icons-react";
import { useSidebar } from "@/hooks/useSidebar";
import { userNavItems } from "@/constants/data";
import { UserSidebarDashboardNav } from "@/components/layouts/user-navigation/user-sidebar-dashboard-nav";
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string;
};

export default function UserSidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" }); // You can set a callback URL after logout
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
            <UserSidebarDashboardNav
              items={userNavItems.map((item) => {
                if (item.label === "signout") {
                  return {
                    ...item,
                    onClick: handleLogout, // Use the handleLogout function
                    href: "#", // Disable default link behavior for logout
                  };
                }
                return item;
              })}
            />
          </div>
          <div className="mt-3 space-y-1">
            <h3 className="mb-2 font-semibold">Favorite Locations</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-400"></span>{" "}
                XD Club, Toronto
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-purple-400"></span>{" "}
                Avengars Club, LA
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-pink-400"></span>{" "}
                Super Stay, Lahore
              </li>
            </ul>
            <div className="mt-4 flex justify-center">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                aria-label="Add Favorite Location"
              >
                <span className="text-2xl font-bold text-white">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
