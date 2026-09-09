import { Icons, TablerIcons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  onClick?: () => void;
}

export interface UserNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof TablerIcons; // Updated to use TablerIcons keys
  label?: string;
  description?: string;
  onClick?: () => void;
}
