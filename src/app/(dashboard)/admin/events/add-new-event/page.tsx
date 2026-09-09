import React from "react";
import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/components/layouts/page-container";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import AddeNewEventForm from "@/components/forms/event-forms/add-new-event-form";

export default function AddNewEventsPage() {
  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <AddeNewEventForm/>
    </PageContainer>
  );
}
