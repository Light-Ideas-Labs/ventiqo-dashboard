"use client"

import { IconBrowserCheck, IconExclamationCircle, IconNotification, IconPalette, IconTool, IconUser, } from '@tabler/icons-react';
import { Layout } from "@/components/layouts/profile-layout/layout";
import Header from "@/components/layouts/profile-layout/Header";
import Body from "@/components/layouts/profile-layout/Body";
import { Separator } from '@/components/ui/separator';
import { Search } from '@/components/ui/search'
import ProfileSidebarNav from "./components/profile-sidebar-nav"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function Settings({ children }: SettingsLayoutProps) {
  return (
    <Layout fixed>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </Header>
      <Body className='flex flex-col'>
      <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <ProfileSidebarNav items={profileSidebarNavItems} />
          </aside>
          <div className='flex w-full p-1 pr-4 md:overflow-y-hidden'>
          {children}
          </div>
        </div>
      </Body>
    </Layout>
  );
}

// profileSidebarNavItems
const profileSidebarNavItems = [
    {
      title: 'Profile',
      icon: <IconUser size={18} />,
      href: '/admin/settings',
    },
    {
      title: 'Account',
      icon: <IconTool size={18} />,
      href: '/admin/settings/account',
    },
    {
      title: 'Appearance',
      icon: <IconPalette size={18} />,
      href: '/admin/settings/appearance',
    },
    {
      title: 'Notifications',
      icon: <IconNotification size={18} />,
      href: '/admin/settings/notifications',
    },
  ]
