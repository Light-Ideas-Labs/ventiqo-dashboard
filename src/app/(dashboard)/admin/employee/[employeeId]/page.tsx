import PageContainer from '@/components/layouts/page-container';

export default function EmployeeDetailsPage({
  params,
}: {
  params: { employeeId: string };
}) {
  return (
    <PageContainer>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Employee</h1>
        <p className="text-sm text-muted-foreground">
          Employee detail view for ID {params.employeeId} is not yet implemented.
        </p>
      </div>
    </PageContainer>
  );
}
