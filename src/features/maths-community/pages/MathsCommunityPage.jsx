import Icon from "@/components/ui/Icon";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SelectPicker from "rsuite/SelectPicker";
import { Button, Card, Col, Row } from "@/components/ui";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { TableLoader } from "@/components/common/DataState";
import Fancybox from "@/components/common/Fancybox";
import Pagination from "@/components/common/Pagination";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import StatusCell from "@/components/common/StatusCell";
import StatusFilter from "@/components/common/StatusFilter";
import RestoreButton from "@/components/common/RestoreButton";
import { confirmDelete, confirmRestore } from "@/components/common/confirmDelete";
import { ANSWER_TYPE, STATUS_DELETED, STATUS_VISIBLE, statusParam } from "@/config/constants";
import { paths } from "@/app/router/paths";
import { timeAgo } from "@/utils/date";
import {
  useCommunityQuestions,
  useDeleteCommunityQuestion,
  useRestoreCommunityQuestion,
  useToggleCommunityStatus,
} from "../api";
import { useScrollTopButton } from "../useScrollTopButton";
import {
  BTN_ICON,
  FILTER_SELECT,
  HEADING_ACTIONS,
  RICH_CONTENT,
  THUMB_50,
} from "@/features/ui-classes";
import NoData from "@/features/NoData";
import PageHeader from "@/components/common/PageHeader";
import CommunityUser from "../components/CommunityUser";
import VerifiedPill from "../components/VerifiedPill";
import { cn } from "@/utils/cn";

export default function MathsCommunityPage() {
  // The view page hands back the page / size / scroll position it was opened from.
  const initialState = useLocation().state;

  const size = initialState?.size || 50;
  const [page, setPage] = useState(() => initialState?.page || 1);
  const [filters, setFilters] = useState({ startDate: "", filter: "", endDate: "", status: STATUS_VISIBLE });

  const { data, isLoading, isFetching } = useCommunityQuestions({
    startDate: filters.startDate,
    filter: filters.filter,
    endDate: filters.endDate,
    page,
    status: statusParam(filters.status),
  });
  const toggleStatus = useToggleCommunityStatus();
  const remove = useDeleteCommunityQuestion();
  const restore = useRestoreCommunityQuestion();
  const { visible: showScrollTop, scrollToTop } = useScrollTopButton();

  const questions = data?.community_question ?? [];
  const total = questions.length === 0 ? 0 : (data?.pagination?.total_records ?? 0);

  const updateFilters = (patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const restoredScroll = useRef(false);
  const savedScrollY = initialState?.scrollY;
  useEffect(() => {
    if (!isLoading && typeof savedScrollY === "number" && !restoredScroll.current) {
      window.scrollTo({ top: savedScrollY, behavior: "auto" });
      restoredScroll.current = true;
    }
  }, [isLoading, savedScrollY]);

  const viewLink = (id) =>
    `${paths.mathsCommunity.view(id)}?${new URLSearchParams({
      page: String(page),
      size: String(size),
      filter: filters.filter || "",
      status: String(filters.status ?? STATUS_VISIBLE),
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      scrollY: String(window.scrollY || 0),
    }).toString()}`;

  return (
    <>
      <PageHeader
        title="Maths Community"
        description="Review and moderate questions and answers from the community."
        titleClassName="my-1"
        count={total}
        actions={
          <div className={HEADING_ACTIONS}>
            <SelectPicker
              cleanable={false}
              searchable={false}
              data={ANSWER_TYPE}
              onChange={(value) => updateFilters({ filter: value })}
              className={FILTER_SELECT}
              placeholder="Select Answer"
              placement="bottomEnd"
              defaultValue={"all"}
            />
            <StatusFilter value={filters.status} onChange={(value) => updateFilters({ status: value })} />
            <DateRangeFilter
                            startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={updateFilters}
            />
            <Link to={paths.mathsCommunity.add} >
              <Button variant="primary" value="create">
                New Question
              </Button>
            </Link>
          </div>
        }
      />

      <div className="relative">
        <TableLoader loading={isLoading || isFetching} />
        {questions.map((question, index) => (
          <Card className="mb-4" key={question.id ?? index}>
            <Card.Header className="border-b border-(--border)">
              <Row className="items-center">
                <Col md={6}>
                  <CommunityUser
                    number={(page - 1) * size + index + 1}
                    profile={question.get_user_profile}
                    meta={[
                      timeAgo(question.created_at),
                      "Math",
                      `${question.get_answer_count} Answer Found`,
                    ]}
                  />
                </Col>
                <Col md={6} className="flex items-center gap-3 max-md:mt-3 md:justify-end">
                  <StatusCell status={question.status} onToggle={() => toggleStatus.mutate(question.id)} />
                  <Button
                    as={Link}
                    size="sm"
                    className="px-4 py-1 focus:text-white"
                    to={viewLink(question.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See Answer
                  </Button>
                  {question.status === STATUS_DELETED ? (
                    <RestoreButton
                      onClick={() =>
                        confirmRestore(() => restore.mutateAsync(question.id), {
                          title: "Restore this question?",
                          message: "The answers and images deleted together with it come back too.",
                        })
                      }
                    />
                  ) : (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className={BTN_ICON}
                      type="button"
                      title="Delete"
                      aria-label="Delete"
                      onClick={() => confirmDelete(() => remove.mutateAsync(question.id))}
                    >
                      <Icon name="trash" />
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="relative rounded-[12px] p-4">
              {question.get_right_answer_count >= 1 && <VerifiedPill title="Right Answer Found" />}

              <div className="mb-4">
                <div
                  className={cn("text-[15px] leading-[1.7]", RICH_CONTENT)}
                  dangerouslySetInnerHTML={{ __html: question.user_math_question }}
                />
              </div>

              {question.get_question_image?.length >= 1 && (
                <div className="flex flex-wrap gap-2">
                  {question.get_question_image.map((image, imageIndex) => (
                    <Fancybox key={imageIndex}>
                      <a data-fancybox="gallery" href={image.image}>
                        <img src={image.image} className={THUMB_50} alt="Question attachment" />
                      </a>
                    </Fancybox>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
        {!isLoading && total === 0 && (
          <Card>
            <Card.Body className="text-center flex items-center justify-center">
              <NoData />
            </Card.Body>
          </Card>
        )}
        {total > size && (
          <Card>
            <Card.Body>
              <Pagination
                className="m-0"
                current={page}
                total={total}
                pageSize={size}
                onChange={setPage}
              />
            </Card.Body>
          </Card>
        )}
      </div>
      {showScrollTop && <ScrollToTopButton onClick={scrollToTop} />}
    </>
  );
}
