import FormActions from "@/components/common/FormActions";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SelectPicker from "rsuite/SelectPicker";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Card, Col, Form, Row } from "@/components/ui";
import PageHeader from "@/components/common/PageHeader";
import { paths } from "@/app/router/paths";
import { useCommunityUsers, useCreateCommunityQuestion } from "../api";
import { FIELD_ERROR } from "@/features/ui-classes";

export default function MathsCommunityAddPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState("");
  const [question, setQuestion] = useState("");

  const { data: userList } = useCommunityUsers();
  const create = useCreateCommunityQuestion();
  const submitting = create.isPending;

  const userOptions = useMemo(
    () => [
      { label: "Select User", value: "" },
      ...(userList ?? []).map((user) => ({ label: user.user_name, value: user.id })),
    ],
    [userList],
  );

  const validateForm = () => {
    const temp = {};
    if (!userId) temp.user = "Select user";
    if (!question || question.replace(/<[^>]*>/g, "").trim() === "")
      temp.question = "Enter question";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (submitting || !validateForm()) return;

    const form = new FormData();
    form.append("user_id", userId);
    form.append("question", question);
    form.append("questionImage", selectedFile);

    create.mutate(form, {
      onSuccess: () => {
        setErrors({});
        navigate(paths.mathsCommunity.list);
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Create Maths Community"
        description="Post a new question on behalf of a user."
        crumbs={[
          { label: "Maths Community", to: paths.mathsCommunity.list },
          { label: "Create Maths Community" },
        ]}
      />

      <Form>
        <Row>
          <Col xs={12}>
            <Card className="mb-6">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Label htmlFor="user">User</Form.Label>
                    <SelectPicker
                      data={userOptions}
                      placement="bottomEnd"
                      className="my-2"
                      placeholder="Select User"
                      block
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
                      accept="image/*"
                      className="my-2"
                      name="image"
                      onChange={(event) => setSelectedFile(event.target.files[0])}
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label htmlFor="question" className="mb-2">
                      Question
                    </Form.Label>
                    <CKEditor
                      name="user_math_question"
                      config={{ placeholder: "Enter Your Question" }}
                      data={question}
                      editor={ClassicEditor}
                      onChange={(_event, editor) => {
                        setQuestion(editor.getData());
                        setErrors((prev) => ({ ...prev, question: "" }));
                      }}
                    />
                    {errors.question && <div className={FIELD_ERROR}>{errors.question}</div>}
                  </Col>
                </Row>
              </Card.Body>
              <FormActions cancelTo={paths.mathsCommunity.list} onSave={handleSubmit} submitting={submitting} />
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
}
