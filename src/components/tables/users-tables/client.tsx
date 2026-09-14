"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataError from "@/components/shared/DataError";
import { useUsers } from "@/state/userAPI";

export default function UserClient() {
  const { data: users, isLoading, isError, refetch } = useUsers();

  if (isError) {
    return <DataError message="Couldn't load users." onRetry={() => refetch()} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                Loading users…
              </TableCell>
            </TableRow>
          ) : !users || users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium text-foreground">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number ?? "—"}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.isVerified
                        ? "border-0 bg-semantic-success-bg text-semantic-success-text"
                        : "border-0 bg-semantic-warning-bg text-semantic-warning-text"
                    }
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
