import { LucideIcon } from "lucide-react";
import { NavItem, UserNavItem } from '@/types/nav-item';
import { signOut } from "next-auth/react"; 

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

// Main Menu Type
export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon; // Icon from Lucide
  submenus: Submenu[];
  onClick?: () => void;
};

// Menu Grouping Type
export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export type User = {
  id: string;  // Adjusted to match the ID format from API response
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  entity: string;
  isVerified: boolean;  // Changed from 'verified' to 'isVerified' to match the API
  profileState: string;
  phone_number?: string;
  age?: string;
  gender?: 'male' | 'female' | 'other';
  preferred_language?: string;
  country?: string;
  // Add any other fields that exist in your API response
};

export type UserProfileResponse = {
  success: boolean;
  message?: string;
  data?: User; // Assuming 'User' is your user profile type
  completionPercentage?: number;
  missingAttributes?: string[]; // If this is part of the error response
};


export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};


export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Events',
    href: '/admin/events', // 
    icon: 'ticket',
    label: 'employee'
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: 'shoppingCart',
    label: 'orders'
  },
  {
    title: 'Payouts',
    href: '/admin/payouts',
    icon: 'billing',
    label: 'payouts'
  },
  {
    title: 'Users',
    href: '/admin/user',
    icon: 'usersRound',
    label: 'user'
  },
  {
    title: 'Organizations',
    href: '/admin/organization',
    icon: 'usersRound',
    label: 'user'
  },
  {
    title: 'Setting',
    href: '/admin/settings',
    icon: 'settings',
    label: 'settings'
  },
  {
    title: 'Sign Out',
    href: '/',
    icon: 'lock',
    label: 'signout',
    onClick: () => signOut({ callbackUrl: "/" }), // Add signOut function here
  }
];


export const userNavItems: UserNavItem[] = [
  {
    title: 'Dashboard',
    href: '/user',
    icon: 'layoutDashboard', // Matches TablerIcons key
    label: 'Dashboard'
  },
  {
    title: 'Orders',
    href: '/user/orders',
    icon: 'users',
    label: 'orders'
  },
  {
    title: 'Search Events',
    href: '/user/events',
    icon: 'users', // Updated to match a valid TablerIcons key
    label: 'events'
  },
  {
    title: 'Inbox',
    href: '/user/inbox',
    icon: 'messages', // Updated to match a valid TablerIcons key
    label: 'inbox'
  },
  {
    title: 'Invites',
    href: '/user/invites',
    icon: 'invites', // Updated to match a valid TablerIcons key
    label: 'invites'
  },
  {
    title: 'My Calendar',
    href: '/user/my/calendar',
    icon: 'calendar', // Updated to match a valid TablerIcons key
    label: 'calendar'
  },
  {
    title: 'Settings',
    href: '/user/settings',
    icon: 'settings', // Valid icon name in TablerIcons
    label: 'settings'
  },
  {
    title: 'Sign Out',
    href: '#', // Use '#' because we will handle logout via onClick
    icon: 'lock', // Updated to match a valid TablerIcons key for a lock or sign-out symbol
    label: 'signout',
    onClick: () => signOut({ callbackUrl: "/" }), // Add signOut function here
  }
];

