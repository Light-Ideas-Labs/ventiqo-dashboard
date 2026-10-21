import { BreadcrumbWrapper } from '@/components/ui/breadcrumb';
import PageContainer from '@/components/layouts/page-container';
import AdminOrdersTable from '@/components/tables/orders-tables/admin-orders-table';

export default function page() {
  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <div className="space-y-2">
        <BreadcrumbWrapper pageName="Orders" />
        <AdminOrdersTable />
      </div>
    </PageContainer>
  );
}
