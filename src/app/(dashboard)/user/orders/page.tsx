import { BreadcrumbWrapper } from '@/components/ui/breadcrumb';
import PageContainer from '@/components/layouts/page-container';
import { UserOrdersTable } from "@/components/tables/orders-tables/user-orders-table"

export default function page() {
    return (
      <PageContainer scrollable={true}>
        <div className="space-y-2">
        <BreadcrumbWrapper pageName="Orders" />
        <UserOrdersTable/>
        </div>
      </PageContainer>
    );
  }