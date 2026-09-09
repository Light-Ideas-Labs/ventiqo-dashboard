import UserHeader from '@/components/layouts/user-navigation/user-header';
import UserSidebar from '@/components/layouts/user-navigation/user-sidebar';
import Footer from '@/components/navbar/footer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ventiqo User Dashboard',
  description: 'User dashboard for Ventiqo: Discover events, manage bookings, view tickets, and access personalized event recommendations. Enjoy a seamless experience with insights into your bookings, upcoming events, and saved favorites.'
};


export default function UserDashboardLayout({
    children
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex flex-col flex-1 w-full">
        <UserHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};