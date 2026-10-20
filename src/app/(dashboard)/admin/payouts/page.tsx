import { BreadcrumbWrapper } from '@/components/ui/breadcrumb';
import PageContainer from '@/components/layouts/page-container';
import AdminPayoutsReview from '@/components/payouts/AdminPayoutsReview';

export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6">
        <BreadcrumbWrapper pageName="Payouts" />
        <AdminPayoutsReview />
      </div>
    </PageContainer>
  );
}
