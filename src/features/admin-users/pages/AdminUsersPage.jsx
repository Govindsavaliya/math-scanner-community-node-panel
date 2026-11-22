import { useEffect, useState } from "react";
import { Button, Card, Col, Icon, Row, Table } from "@/components/ui";
import PageHeader from "@/components/common/PageHeader";
import Avatar from "@/components/common/Avatar";
import { EmptyRow, TableLoader } from "@/components/common/DataState";
import { SkeletonRows } from "@/components/common/Skeleton";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/SearchInput";
import StatusBadge from "@/components/common/StatusBadge";
import StatusFilter from "@/components/common/StatusFilter";
import RestoreButton from "@/components/common/RestoreButton";
import { confirmDelete, confirmRestore } from "@/components/common/confirmDelete";
import { DEFAULT_PAGE_SIZE, STATUS_DELETED, STATUS_VISIBLE, statusParam } from "@/config/constants";
import { HEADING_ACTIONS, SEARCH_WIDTH } from "@/features/ui-classes";
import { notify } from "@/lib/notify";
import { dateFormat } from "@/utils/date";
import { useAdminUsers, useDeleteAdminUser, useRestoreAdminUser } from "../api";

const ROLE_LABEL = { super_admin: "Super admin", admin: "Admin", viewer: "Viewer" };

const isSuperAdmin = (admin) => admin.role === "super_admin";

const statusBadge = (status) => {
  if (status === STATUS_DELETED) return <StatusBadge tone="danger">Deleted</StatusBadge>;
  return status === 1 ? <StatusBadge tone="success">Active</StatusBadge> : <StatusBadge>Inactive</StatusBadge>;
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ search: "", status: STATUS_VISIBLE });

  const { data, error, isLoading, isFetching } = useAdminUsers({
    page,
    search: filters.search,
    status: statusParam(filters.status),
  });
  const remove = useDeleteAdminUser();
  const restore = useRestoreAdminUser();

  // Super admins are listed first (stable sort keeps the API order within each group).
  const rows = [...(data?.adminUsers ?? [])].sort((a, b) => isSuperAdmin(b) - isSuperAdmin(a));
  const total = data?.pagination?.total_records ?? 0;

  useEffect(() => {
    // Only super admins may manage admin accounts; anyone else gets a 403.
    if (error) notify.error(error.message || "Failed to load admin users");
  }, [error]);

  const updateFilters = (patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <>
      <PageHeader
        title="Admin Users"
        description="Accounts that can sign in to this panel. Only super admins can manage them."
        titleClassName="my-1"
        count={total}
        actions={
          <div className={HEADING_ACTIONS}>
            <SearchInput
              name="search"
              value={search}
              placeholder="Name or email..."
              className={SEARCH_WIDTH}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => updateFilters({ search: search.trim() })}
              loading={isFetching}
              ariaLabel="Search admin users by name or email"
            />
            <StatusFilter value={filters.status} onChange={(value) => updateFilters({ status: value })} />
          </div>
        }
      />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <TableLoader loading={isLoading || isFetching} />
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && rows.length === 0 && <SkeletonRows cols={6} />}
                  {!isLoading && rows.length === 0 && (
                    <EmptyRow
                      title={error ? "Access denied" : "No admin users found"}
                      hint={error ? "Only super admins can manage admin accounts." : "Try changing the search or filters."}
                      icon="shield-check"
                    />
                  )}
                  {rows.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={admin.name || admin.email} />
                          <span className="font-medium text-ink capitalize">{admin.name || "-"}</span>
                        </div>
                      </td>
                      <td className="text-muted">{admin.email || "-"}</td>
                      <td>
                        <StatusBadge tone="info" dot={false}>
                          {ROLE_LABEL[admin.role] ?? ROLE_LABEL.super_admin}
                        </StatusBadge>
                      </td>
                      <td className="whitespace-nowrap text-muted">{admin.created_at ? dateFormat(admin.created_at) : "-"}</td>
                      <td className="text-center">{statusBadge(admin.status)}</td>
                      <td className="text-center whitespace-nowrap">
                        {admin.status === STATUS_DELETED ? (
                          <RestoreButton
                            onClick={() =>
                              confirmRestore(() => restore.mutateAsync(admin.id), {
                                title: "Restore this admin?",
                                message: "The account becomes active and can sign in again.",
                              })
                            }
                          />
                        ) : isSuperAdmin(admin) ? null : (
                          <Button
                            variant="outline-danger"
                            size="icon-sm"
                            title="Delete"
                            aria-label="Delete admin user"
                            onClick={() =>
                              confirmDelete(() => remove.mutateAsync(admin.id), {
                                title: "Delete this admin?",
                                message: "The account can no longer sign in. You can restore it later.",
                              })
                            }
                          >
                            <Icon name="trash" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination current={page} total={total} pageSize={DEFAULT_PAGE_SIZE} onChange={setPage} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
