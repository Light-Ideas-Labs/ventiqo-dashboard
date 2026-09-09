import ThemeToggle from '@/components/layouts/ThemeToggle/theme-toggle';
import DropdownNotification from "@/components/layouts/dropdown-notifications"
import { UserMobileSidebar } from './user-mobile-sidebar';
import { UserHeaderProfileNav } from './user-header-profile-nav';
import { cn } from '@/lib/utils';


export default function UserHeader() {
    return (
      <header className="sticky inset-x-0 top-0 w-full">
        <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
          <div className={cn('block lg:!hidden')}>
            <UserMobileSidebar />
          </div>
          <div className="flex items-center gap-2"> 
            <DropdownNotification />
            <UserHeaderProfileNav />  
            <ThemeToggle />
          </div>
        </nav>
      </header>
    );
  }