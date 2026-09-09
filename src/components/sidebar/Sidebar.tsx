"use client"

import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Megaphone,
  Wallet,
  Bell,
  LogOut,
  Plus
} from "lucide-react"

import SidebarItem from "./SidebarItem"

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white/70 backdrop-blur-xl border-r flex flex-col justify-between p-4">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="text-xl font-bold mb-6">
          🎟️ Ventiqo
        </div>

        {/* CREATE EVENT CTA */}
        <button className="flex items-center gap-2 w-full mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl shadow">
          <Plus size={16} />
          Create Event
        </button>

        {/* CORE */}
        <div className="space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Calendar} label="Events" />
          <SidebarItem icon={Ticket} label="Bookings" />
          <SidebarItem icon={Users} label="Tickets" />
        </div>

        {/* GROWTH */}
        <div className="mt-6 text-xs text-gray-500">GROWTH</div>
        <div className="space-y-1">
          <SidebarItem icon={Megaphone} label="Marketing" />
          <SidebarItem icon={Megaphone} label="Promotions" />
        </div>

        {/* FINANCE */}
        <div className="mt-6 text-xs text-gray-500">FINANCE</div>
        <div className="space-y-1">
          <SidebarItem icon={Wallet} label="Revenue" />
          <SidebarItem icon={CreditCard} label="Subscriptions" />
        </div>

        {/* SYSTEM */}
        <div className="mt-6 text-xs text-gray-500">SYSTEM</div>
        <div className="space-y-1">
          <SidebarItem icon={BarChart3} label="Analytics" />
          <SidebarItem icon={Bell} label="Notifications" />
          <SidebarItem icon={Settings} label="Settings" />
        </div>
      </div>

      {/* BOTTOM WIDGET */}
      <div className="bg-gray-100 rounded-xl p-3 text-sm">
        <p className="text-gray-500">Today</p>
        <p className="font-semibold">$1,240 Revenue</p>
        <p className="text-xs text-gray-500">320 Tickets sold</p>

        <button className="mt-3 flex items-center gap-2 text-red-500">
          <LogOut size={14} />
          Logout
        </button>
      </div>

    </aside>
  )
}