import Image from "next/image";
import { Metadata } from "next";
import PageContainer from "@/components/layouts/page-container";
import RecentEventList from "@/components/forms/event-forms/recent-event-list"; 
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger  } from "@/components/ui/tabs";
import { OverviewSectionsCards } from "@/components/statitiscs/overview-sections-cards";

export const metadata: Metadata = {
  title: "Ventiqo Admin Dashboard",
  description: "Manage and monitor all aspects of Ventiqo's event platform, including events, users, payments, and analytics. The admin panel provides powerful tools and insights to ensure smooth event operations and effective platform management."
};

const Admin = () => {
  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <div className="space-y-6">
        {/* Dashboard Overview */}

        <OverviewSectionsCards />
        
        {/* Recent Event List and Calendar */}
        <div className="grid gap-6 lg:grid-cols-2">
        <RecentEventList /> {/* Use the RecentEventList component here */}


          {/* Calendar */}
          <Card className="border">
            <CardHeader>
              <CardTitle>October 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-gray-100 rounded-lg">
                Calendar Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Admin;
