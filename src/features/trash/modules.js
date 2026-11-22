/** Trash modules (the `module` key of the API) in the order of the tabs. */
export const TRASH_MODULES = [
  { key: "users", label: "Users" },
  { key: "questions", label: "Questions" },
  { key: "answers", label: "Answers" },
  { key: "answer-images", label: "Answer images" },
  { key: "admin-users", label: "Admin users" },
  { key: "contact-us", label: "Contact messages" },
];

export const moduleLabel = (key) => TRASH_MODULES.find((m) => m.key === key)?.label ?? key;

/** Whole days until a trashed record becomes eligible for "Empty trash" (0 once it is). */
export const daysLeft = (purgeAfter) => {
  if (!purgeAfter) return 0;
  return Math.max(0, Math.ceil((new Date(purgeAfter).getTime() - Date.now()) / 86_400_000));
};
