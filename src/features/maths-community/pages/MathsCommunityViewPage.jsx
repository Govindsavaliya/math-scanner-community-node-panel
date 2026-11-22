import Icon from "@/components/ui/Icon";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SelectPicker from "rsuite/SelectPicker";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Card, Col, Form, Modal, Row } from "@/components/ui";
import Fancybox from "@/components/common/Fancybox";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import StatusSwitch from "@/components/common/StatusSwitch";
import { confirmDelete } from "@/components/common/confirmDelete";
import { STATUS_VISIBLE } from "@/config/constants";
import { paths } from "@/app/router/paths";
import { timeAgo } from "@/utils/date";
import {
  useCommunityQuestion,
  useCommunityUsers,
  useDeleteAnswer,
  useDeleteAnswerImage,
  useGiveAnswer,
  useMarkRightAnswer,
  useToggleAnswerImageStatus,
  useToggleAnswerStatus,
} from "../api";
import { useScrollTopButton } from "../useScrollTopButton";
import { FIELD_ERROR, RICH_CONTENT, THUMB_50, THUMB_75 } from "@/features/ui-classes";
import BackLink from "@/features/BackLink";
import PageHeader from "@/components/common/PageHeader";
import CommunityUser from "../components/CommunityUser";
import VerifiedPill from "../components/VerifiedPill";
import PageLoader from "@/components/common/PageLoader";

export default function MathsCommunityViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const listState = location.state;
  const searchParams = new URLSearchParams(location.search);
  const { id } = useParams();

  const [answer, setAnswer] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState("");
  const [show, setShow] = useState(false);

  const { data, isLoading } = useCommunityQuestion(id);
  const { data: userList } = useCommunityUsers({ enabled: show });
  const giveAnswer = useGiveAnswer();
  const markRight = useMarkRightAnswer();
  const toggleAnswerStatus = useToggleAnswerStatus();
  const toggleImageStatus = useToggleAnswerImageStatus();
  const removeAnswer = useDeleteAnswer();
  const removeImage = useDeleteAnswerImage();
  const { visible: showScrollTop, scrollToTop } = useScrollTopButton();

  const question = data?.community_question ?? {};
  const answers = data?.question_answer?.data;
  const totalAnswers = data?.question_answer?.pagination?.total_records ?? 0;
  const submitting = giveAnswer.isPending;

  const userOptions = useMemo(
    () => (userList ?? []).map((user) => ({ label: user.user_name, value: user.id })),
    [userList],
  );

  const handleClose = () => setShow(false);

  const validateForm = () => {
    const temp = {};
    if (!userId) temp.user = "Select user";
    if (!answer || answer.replace(/<[^>]*>/g, "").trim() === "") temp.answer = "Enter answer";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (submitting || !validateForm()) return;

    const form = new FormData();
    form.append("user_id", userId);
    form.append("answer", answer);
    form.append("question_id", id);
    selectedFiles.forEach((file) => form.append("answerImages", file));

    giveAnswer.mutate(form, {
      onSuccess: () => {
        setShow(false);
        setAnswer("");
        setErrors({});
      },
    });
  };

  const handleBack = () => {
    const backState =
      listState && listState.page
        ? listState
        : {
            page: parseInt(searchParams.get("page") || "1", 10),
            size: parseInt(searchParams.get("size") || "50", 10),
            query: {
              filter: searchParams.get("filter") || "",
              status: searchParams.get("status") || STATUS_VISIBLE,
              startDate: searchParams.get("startDate") || "",
              endDate: searchParams.get("endDate") || "",
              page: parseInt(searchParams.get("page") || "1", 10),
            },
            scrollY: parseInt(searchParams.get("scrollY") || "0", 10),
          };
    if (backState && backState.page) {
      navigate(paths.mathsCommunity.list, { state: backState });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <PageHeader
        title={
          <>
            <BackLink onClick={handleBack} />
            Community Question
          </>
        }
      />
      {!isLoading ? (
        <>
          <Card>
            <Card.Header className="border-b border-(--border)">
              <Row className="items-center">
                <Col md={6}>
                  <CommunityUser
                    profile={question.get_user_profile}
                    meta={[
                      timeAgo(question?.created_at) || "-",
                      "Math",
                      `${totalAnswers} Answer Found`,
                    ]}
                  />
                </Col>
                <Col md={6} className="text-end">
                  <Button
                    size="sm"
                    className="ms-4 my-1 px-4 py-1"
                    type="button"
                    onClick={() => setShow(true)}
                  >
                    Give Answer
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="relative">
              <div
                className={RICH_CONTENT}
                dangerouslySetInnerHTML={{ __html: question?.user_math_question }}
              ></div>
              <div className="my-4 flex flex-wrap gap-2">
                {question?.get_question_image?.map((img, index) => (
                  <div key={index}>
                    <Fancybox>
                      <a href={img?.image} data-fancybox="gallery">
                        <img src={img?.image} className={THUMB_50} alt={`Question attachment ${index + 1}`} />
                      </a>
                    </Fancybox>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <div className="mt-6">
            <PageHeader title="Community Answer" />
          </div>
          {answers?.length > 0 ? (
            answers.map((item, index) => (
              <Card className="mb-4" key={item.id ?? index}>
                <Card.Header className="border-b border-(--border)">
                  <Row className="items-center">
                    <Col md={6}>
                      <CommunityUser
                        profile={item.get_user_profile}
                        meta={[timeAgo(item.created_at), "Math"]}
                      />
                    </Col>
                    <Col md={6} className="text-end">
                      <div className="flex items-center justify-end">
                        <StatusSwitch
                          checked={item.status === 1}
                          onChange={() => toggleAnswerStatus.mutate(item.id)}
                        />
                        {item.is_right_answer === 0 && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-4 my-1 px-4 py-1"
                            onClick={() => markRight.mutate(item.id)}
                          >
                            Right Answer
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="icon-sm"
                          className="ms-3"
                          title="Delete answer"
                          aria-label="Delete answer"
                          onClick={() =>
                            confirmDelete(() => removeAnswer.mutateAsync(item.id), {
                              title: "Delete this answer?",
                              message: "The answer and its images are hidden and can be restored from the Trash.",
                            })
                          }
                        >
                          <Icon name="trash" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="relative rounded-[12px] p-4">
                  {item.is_right_answer >= 1 && <VerifiedPill />}
                  <div
                    className={RICH_CONTENT}
                    dangerouslySetInnerHTML={{ __html: item?.math_question_answer }}
                  ></div>
                  <div className="flex flex-wrap gap-2">
                    {item.get_answer_image.map((img, imageIndex) => (
                      <div className="flex flex-col" key={img.id ?? imageIndex}>
                        <div className="my-4 flex flex-wrap gap-2">
                          <Fancybox>
                            <a href={img.image} data-fancybox="gallery">
                              <img src={img.image} className={THUMB_75} alt={`Answer attachment ${imageIndex + 1}`} />
                            </a>
                          </Fancybox>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusSwitch
                            checked={img.status === 1}
                            onChange={() => toggleImageStatus.mutate(img.id)}
                          />
                          <Button
                            variant="outline-danger"
                            size="icon-sm"
                            title="Delete image"
                            aria-label="Delete image"
                            onClick={() =>
                              confirmDelete(() => removeImage.mutateAsync(img.id), {
                                title: "Delete this image?",
                                message: "The image is hidden and can be restored from the Trash.",
                              })
                            }
                          >
                            <Icon name="trash" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Card>
              <Card.Body>
                <div className="py-12 text-muted flex flex-col justify-center items-center">
                  <Icon name="message-off" className="text-[calc(1.375rem+1.5vw)] xl:text-[2.5rem]" />
                  <p className="mt-4 mb-0">No answer found yet.</p>
                </div>
              </Card.Body>
            </Card>
          )}
        </>
      ) : (
        <PageLoader />
      )}

      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Answer of Question Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Label htmlFor="user">User</Form.Label>
              <SelectPicker
                data={userOptions}
                placement="autoVerticalStart"
                menuStyle={{ zIndex: 9999 }}
                className="my-2"
                placeholder="Select User"
                block
                searchable={true}
                cleanable={false}
                onChange={(value) => {
                  setUserId(value);
                  setErrors((prev) => ({ ...prev, user: "" }));
                }}
              />
              {errors.user && <div className={FIELD_ERROR}>{errors.user}</div>}
            </Col>
            <Col md={6}>
              <Form.Label htmlFor="image">Image</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                className="my-2"
                name="image"
                onChange={(event) => setSelectedFiles(Array.from(event.target.files))}
              />
            </Col>
            <Col md={12}>
              <Form.Label htmlFor="question" className="mb-2">
                Answer
              </Form.Label>
              <CKEditor
                name="user_math_question"
                config={{ placeholder: "Enter Your Answer" }}
                data={answer}
                editor={ClassicEditor}
                onChange={(_event, editor) => {
                  setAnswer(editor.getData());
                  setErrors((prev) => ({ ...prev, answer: "" }));
                }}
              />
              {errors.answer && <div className={FIELD_ERROR}>{errors.answer}</div>}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" className="ms-2" onClick={handleSubmit} disabled={submitting}>
            Submit Answer
          </Button>
        </Modal.Footer>
      </Modal>
      {showScrollTop && <ScrollToTopButton onClick={scrollToTop} />}
    </>
  );
}
