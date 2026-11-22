import { useState } from "react";
import { Button, Card, Col, Icon, Modal, Row, Table } from "@/components/ui";
import PageHeader from "@/components/common/PageHeader";
import DateRangeFilter from "@/components/common/DateRangeFilter";
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
import { dateFormat } from "@/utils/date";
import { useContactUs, useDeleteContactUs, useRestoreContactUs } from "../api";

export default function ContactUsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: "", startDate: "", endDate: "", status: STATUS_VISIBLE });

  const { data, isLoading, isFetching } = useContactUs({ ...filters, status: statusParam(filters.status), page });
  const remove = useDeleteContactUs();
  const restore = useRestoreContactUs();

  const rows = data?.contactUs ?? [];
  const total = data?.pagination?.total_records ?? 0;

  const updateFilters = (patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Messages submitted through the Contact Us form."
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
            />
            <StatusFilter value={filters.status} onChange={(value) => updateFilters({ status: value })} />
            <DateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={updateFilters}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Submitted</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && rows.length === 0 && <SkeletonRows cols={5} />}
                  {!isLoading && rows.length === 0 && (
                    <EmptyRow title="No messages yet" hint="Messages from the Contact Us form will appear here." icon="mail" />
                  )}
                  {rows.map((contact, index) => (
                    <tr key={contact.id ?? index}>
                      <td className="font-medium text-ink capitalize">{contact.name || "-"}</td>
                      <td className="text-muted">{contact.email || "-"}</td>
                      <td className="max-w-90">
                        <p className="m-0 truncate text-muted" title={contact.description}>{contact.description || "-"}</p>
                      </td>
                      <td className="whitespace-nowrap text-muted">{contact.createdAt ? dateFormat(contact.createdAt) : "-"}</td>
                      <td className="text-center whitespace-nowrap">
                        {contact.status === STATUS_DELETED ? (
                          <>
                            <StatusBadge tone="danger" className="me-2">Deleted</StatusBadge>
                            <RestoreButton onClick={() => confirmRestore(() => restore.mutateAsync(contact.id), { title: "Restore this message?" })} />
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline-secondary"
                              size="icon-sm"
                              className="me-2"
                              title="View"
                              aria-label="View message"
                              onClick={() => setSelected(contact)}
                            >
                              <Icon name="eye" />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="icon-sm"
                              title="Delete"
                              aria-label="Delete message"
                              onClick={() => confirmDelete(() => remove.mutateAsync(contact.id), { title: "Delete this message?", message: "It is hidden from this list and can be restored later." })}
                            >
                              <Icon name="trash" />
                            </Button>
                          </>
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
      <Modal show={Boolean(selected)} onHide={() => setSelected(null)}>
        <Modal.Header closeButton onHide={() => setSelected(null)}>
          <Modal.Title>Message details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <dl className="m-0 space-y-4 text-[14px]">
            {[
              ["Name", selected?.name],
              ["Email", selected?.email],
              ["Submitted", selected?.createdAt ? dateFormat(selected.createdAt) : "-"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="mb-1 text-[12px] font-semibold tracking-wider text-muted uppercase">{label}</dt>
                <dd className="m-0 text-ink">{value || "-"}</dd>
              </div>
            ))}
            <div>
              <dt className="mb-1 text-[12px] font-semibold tracking-wider text-muted uppercase">Message</dt>
              <dd className="m-0 break-words whitespace-pre-wrap text-ink">{selected?.description || "-"}</dd>
            </div>
          </dl>
        </Modal.Body>
      </Modal>
    </>
  );
}
