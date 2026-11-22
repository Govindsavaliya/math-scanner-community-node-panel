import { useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import { Button, Card, Col, Icon, Row, Table } from "@/components/ui";
import PageHeader from "@/components/common/PageHeader";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { EmptyRow, TableLoader } from "@/components/common/DataState";
import StatusBadge from "@/components/common/StatusBadge";
import { SkeletonRows } from "@/components/common/Skeleton";
import Avatar from "@/components/common/Avatar";
import Fancybox from "@/components/common/Fancybox";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/SearchInput";
import StatusCell from "@/components/common/StatusCell";
import StatusFilter from "@/components/common/StatusFilter";
import RestoreButton from "@/components/common/RestoreButton";
import { confirmDelete, confirmRestore } from "@/components/common/confirmDelete";
import { DEFAULT_PAGE_SIZE, LOGIN_TYPE, STATUS_DELETED, STATUS_VISIBLE, statusParam } from "@/config/constants";
import { dateFormat } from "@/utils/date";
import { useDeleteUser, useRestoreUser, useToggleUserStatus, useUsers } from "../api";
import { FILTER_SELECT, HEADING_ACTIONS, SEARCH_WIDTH } from "@/features/ui-classes";
import { cn } from "@/utils/cn";

const INITIAL_FILTERS = {
  search: "",
  status: STATUS_VISIBLE,
  startDate: "",
  endDate: "",
  login_type: LOGIN_TYPE[0].value,
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const { data, isLoading, isFetching } = useUsers({ ...filters, status: statusParam(filters.status), page });
  const toggleStatus = useToggleUserStatus();
  const remove = useDeleteUser();
  const restore = useRestoreUser();

  const rows = data?.users ?? [];
  const total = data?.pagination?.total_records ?? 0;

  const updateFilters = (patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="Registered users of the Math Scanner app."
        titleClassName="my-1"
        count={total}
        actions={
          <div className={HEADING_ACTIONS}>
            <SearchInput
              name="name"
              value={search}
              placeholder="Searching..."
              className={SEARCH_WIDTH}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => updateFilters({ search })}
              loading={isFetching}
              ariaLabel="Search users by name"
            />
            <DateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={updateFilters}
            />
            <StatusFilter value={filters.status} onChange={(value) => updateFilters({ status: value })} />
            <SelectPicker
              container={() => document.body}
              cleanable={false}
              searchable={false}
              data={LOGIN_TYPE}
              onChange={(value) => updateFilters({ login_type: value })}
              defaultValue="all"
              className={cn(FILTER_SELECT, "font-normal")}
              placeholder="Select Login Type"
              placement="bottomEnd"
            />
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
                    <th>User</th>
                    <th>Email</th>
                    <th>Login Type</th>
                    <th>Registered</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && rows.length === 0 && <SkeletonRows cols={6} />}
                  {!isLoading && rows.length === 0 && (
                    <EmptyRow title="No users found" hint="Try changing the search or filters." icon="user" />
                  )}
                  {rows.map((user, index) => (
                    <tr key={user.id ?? index}>
                      <td>
                        <div className="flex items-center gap-3">
                          {user.user_image ? (
                            <Fancybox>
                              <a data-fancybox="gallery" href={user.user_image}>
                                <Avatar src={user.user_image} name={user.user_name} />
                              </a>
                            </Fancybox>
                          ) : (
                            <Avatar name={user.user_name} />
                          )}
                          <span className="font-medium text-ink capitalize">{user.user_name || "-"}</span>
                        </div>
                      </td>
                      <td className="text-muted">{user.user_email || "-"}</td>
                      <td>
                        {user.login_type ? (
                          <StatusBadge tone={user.login_type === "gmail" ? "info" : "neutral"} dot={false} className="capitalize">
                            {user.login_type}
                          </StatusBadge>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="whitespace-nowrap text-muted">{user.created_at ? dateFormat(user.created_at) : "-"}</td>
                      <td className="text-center">
                        <StatusCell status={user.status} onToggle={() => toggleStatus.mutate(user.id)} />
                      </td>
                      <td className="text-center whitespace-nowrap">
                        {user.status === STATUS_DELETED ? (
                          <RestoreButton onClick={() => confirmRestore(() => restore.mutateAsync(user.id), { title: "Restore this user?", message: "The user will be able to sign in again. Push tokens and follow links removed at delete time are not restored." })} />
                        ) : (
                          <Button
                            variant="outline-danger"
                            size="icon-sm"
                            title="Delete"
                            aria-label="Delete user"
                            onClick={() => confirmDelete(() => remove.mutateAsync(user.id), { title: "Delete this user?", message: "The user is hidden from the app and can be restored later from the Deleted filter or the Trash." })}
                          >
                            <Icon name="trash" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination
                current={page}
                total={total}
                pageSize={DEFAULT_PAGE_SIZE}
                onChange={setPage}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
