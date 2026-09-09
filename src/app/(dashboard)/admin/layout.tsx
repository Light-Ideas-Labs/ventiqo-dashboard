import AdminHeader from '@/components/layouts/admin-navigation/admin-header';
import AdminSidebar from '@/components/layouts/admin-navigation/admin-sidebar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ventiqo Admin Dashboard',
  description: 'Admin dashboard for Ventiqo: Manage events, users, payments, analytics, and platform settings. Get insights into event performance, sales, and attendee engagement with a user-friendly interface.'
};

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full">
        <AdminHeader />
          <main className="flex-1">
            {children}
          </main>
          </div>
      </div>
      );
    }


