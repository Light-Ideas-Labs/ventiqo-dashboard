"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Ensure this is correctly imported
import { Dispatch, SetStateAction } from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { UserNavItem } from '@/types/nav-item';
import { useSidebar } from '@/hooks/useSidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Type guard to check if a key exists in TablerIcons
const isTablerIcon = (icon: string): icon is keyof typeof Icons => {
  return icon in Icons;
};

// Type guard to check if the icon exists in Icons
const isLucideIcon = (icon: string): icon is keyof typeof Icons => {
  return icon in Icons;
};

interface DashboardNavProps {
  items: UserNavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function UserSidebarDashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const path = usePathname(); // Ensure this hook is correctly used
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          // Check if the icon is a valid Tabler icon
          const IconComponent = item.icon && isLucideIcon(item.icon) ? Icons[item.icon] : Icons["dashboard"]; // Fallback to 'apps' if icon is invalid
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      path === item.href ? 'bg-accent' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault(); // Prevent default link behavior
                        item.onClick(); // Trigger the logout function
                      }
                      if (setOpen) setOpen(false);
                    }}
                  >
                    {IconComponent && <IconComponent className={`ml-3 size-5 flex-none`} />} {/* Safely render IconComponent */}

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
