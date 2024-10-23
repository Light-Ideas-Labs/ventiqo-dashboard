import React from "react";
import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/components/Layouts/page-container";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import AddeNewEventForm from "@/components/Forms/EventForms/add-new-event-form";

export default function AddNewEventsPage() {
  return (
    <PageContainer scrollable={true}>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Events</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add New Event</BreadcrumbPage>
            </BreadcrumbItem>
            {/* <BreadcrumbSeparator /> */}
            {/* <BreadcrumbItem>
              <BreadcrumbPage>{event.title}</BreadcrumbPage>
            </BreadcrumbItem> */}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <AddeNewEventForm/>
    </PageContainer>
  );
}
