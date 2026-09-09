import { BreadcrumbWrapper } from '@/components/ui/breadcrumb';
import PageContainer from '@/components/layouts/page-container';
import UserClient  from '@/components/tables/users-tables/client';

export default function page() {
  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <div className="space-y-2">
      <BreadcrumbWrapper pageName="User" />
        <UserClient />
      </div>
    </PageContainer>
  );
}
