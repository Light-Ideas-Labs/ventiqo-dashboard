import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import Topbar from "@/components/navbar/Topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      
      {/* Sidebar */}
      <AppSidebar />

      {/* Main */}
      <SidebarInset>
        
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="p-6 bg-background min-h-screen">
          {children}
        </main>

      </SidebarInset>
    </SidebarProvider>
  )
}