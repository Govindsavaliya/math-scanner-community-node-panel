import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request, requestData } from "@/lib/http";
import { notify } from "@/lib/notify";

const communityKeys = {
  all: ["maths-community"],
  lists: () => ["maths-community", "list"],
  list: (params) => ["maths-community", "list", params],
  detail: (id) => ["maths-community", "detail", String(id)],
  users: () => ["maths-community", "users"],
};

/** Paginated questions (`{ community_question, pagination }`). */
export const useCommunityQuestions = (params) =>
  useQuery({
    queryKey: communityKeys.list(params),
    queryFn: () => requestData({ method: "POST", url: "/math-community/list", data: params }),
    placeholderData: keepPreviousData,
  });

/** One question with its answers (`{ community_question, question_answer }`). */
export const useCommunityQuestion = (id) =>
  useQuery({
    queryKey: communityKeys.detail(id),
    queryFn: () => requestData({ method: "GET", url: `/math-community/question-answer/${id}` }),
  });

/** Direct-login users for the user dropdown (`[{ label, value }]`-ready rows). */
export const useCommunityUsers = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: communityKeys.users(),
    queryFn: async () => {
      const data = await requestData({
        method: "GET",
        url: "/math-community/login-type-direct-user-list",
      });
      return data?.user_list ?? [];
    },
    enabled,
  });

/**
 * The backend reports business failures as `response_code: false` (surfaced by
 * `request` as an ApiError with status 200); anything else gets `fallback`.
 */
const failureMessage = (error, fallback) =>
  error?.status === 200 && error.message ? error.message : fallback;

/** Toggles a question's status; the cached lists are updated once the server confirms. */
export const useToggleCommunityStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: `/math-community/status/${id}` }),
    onSuccess: (_body, id) => {
      qc.setQueriesData({ queryKey: communityKeys.lists() }, (old) =>
        old?.community_question
          ? {
              ...old,
              community_question: old.community_question.map((q) =>
                q.id === id ? { ...q, status: q.status === 1 ? 0 : 1 } : q,
              ),
            }
          : old,
      );
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Update Data successfully");
    },
    onError: () => notify.error("Update Data Failed"),
  });
};

/** Delete a question; pair with `confirmDelete`. */
export const useDeleteCommunityQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "DELETE", url: `/math-community/delete/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Delete community question successfully");
    },
  });
};

/** Brings a deleted question back with the answers and images deleted together with it. */
export const useRestoreCommunityQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: `/math-community/restore/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Question restored successfully");
    },
  });
};

/** Soft deletes an answer together with its images; pair with `confirmDelete`. */
export const useDeleteAnswer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "DELETE", url: `/math-community/answer/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Delete answer successfully");
    },
  });
};

/** Soft deletes one answer image; pair with `confirmDelete`. */
export const useDeleteAnswerImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "DELETE", url: `/math-community/answer-image/${id}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Delete image successfully");
    },
  });
};

/** Creates a question from FormData (`user_id`, `question`, `questionImage`). */
export const useCreateCommunityQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form) => {
      notify.loading("Loading...");
      try {
        return await request({ method: "POST", url: "/math-community/create", data: form });
      } finally {
        notify.dismiss();
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Add data successfully");
    },
    onError: (error) => notify.error(failureMessage(error, "Failed to add data")),
  });
};

/** Posts an answer from FormData (`user_id`, `answer`, `question_id`, `answerImages`). */
export const useGiveAnswer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form) =>
      request({ method: "POST", url: "/math-community/give-answer", data: form }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success("Add data successfully");
    },
    onError: (error) => notify.error(failureMessage(error, "Failed to submit answer")),
  });
};

/** PUT mutation that refreshes the community cache and toasts `message`. */
const useAnswerAction = (urlFor, message) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => request({ method: "PUT", url: urlFor(id) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.all });
      notify.success(message);
    },
    onError: (error) => notify.error(error.message),
  });
};

export const useMarkRightAnswer = () =>
  useAnswerAction((id) => `/math-community/right-answer/${id}`, "Right Answer Mark successfully");

export const useToggleAnswerStatus = () =>
  useAnswerAction(
    (id) => `/math-community/answer-status/${id}`,
    "Update Answer Status successfully",
  );

export const useToggleAnswerImageStatus = () =>
  useAnswerAction(
    (id) => `/math-community/status-community-answer-image/${id}`,
    "Update Image Status successfully",
  );
