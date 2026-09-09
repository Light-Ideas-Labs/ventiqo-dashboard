import ThemeToggle from '@/components/layouts/ThemeToggle/theme-toggle';
import DropdownNotification from "@/components/layouts/dropdown-notifications"
import { MobileSidebar } from './admin-mobile-sidebar';
import { AdminHeaderProfileNav } from './admin-header-profile-nav';
import { cn } from '@/lib/utils';


export default function AdminHeader() {
    return (
      <header className="sticky inset-x-0 top-0 w-full">
        <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
          <div className={cn('block lg:!hidden')}>
            <MobileSidebar />
          </div>
          <div className="flex items-center gap-2"> 
            <DropdownNotification />   
            <AdminHeaderProfileNav />
            <ThemeToggle />
          </div>
        </nav>
      </header>
    );
  }

