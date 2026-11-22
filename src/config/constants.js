/** Row status written by the API: 1 active, 0 inactive, 2 deleted (soft delete). */
export const STATUS_DELETED = 2;

/**
 * Status filter of every list. "visible" sends no `status` (active + inactive, deleted rows hidden);
 * use `statusParam` to turn the picked value into the API value.
 */
export const STATUS_VISIBLE = "visible";
export const STATUS = [
  { label: "All Status", value: STATUS_VISIBLE },
  { label: "Active", value: 1 },
  { label: "Inactive", value: 0 },
  { label: "Deleted", value: STATUS_DELETED },
];

/**
 * API value for a picked status filter.
 * @param {string|number} value  One of the STATUS values.
 */
export const statusParam = (value) => {
  if (value === STATUS_VISIBLE || value === undefined || value === null || value === "") return undefined;
  return value;
};

export const LOGIN_TYPE = [
  { label: "All Login Types", value: "all" },
  { label: "Gmail", value: "gmail" },
  { label: "Direct", value: "direct" },
];

export const ANSWER_TYPE = [
  { label: "All", value: "all" },
  { label: "Un Answer", value: "un-answer" },
  { label: "Right Answer", value: "right-answer" },
];

export const LANGUAGE = [
  { label: "All Language", value: "all" },
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "Spanish", value: "spanish" },
  { label: "Indonesian", value: "indonesian" },
  { label: "Portuguese", value: "portuguese" },
];

export const DEFAULT_PAGE_SIZE = 10;
