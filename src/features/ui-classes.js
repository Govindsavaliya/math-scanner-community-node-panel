/** Tailwind class strings shared by the admin feature pages (kept as full literals so Tailwind can scan them). */

export const HEADING_ACTIONS = "flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end";
export const FILTER_SELECT = "w-[calc(50%-0.375rem)] min-w-0 sm:w-43.75 sm:min-w-43.75 sm:max-w-43.75";
export const SEARCH_WIDTH = "w-full sm:w-55";

export const THUMB_40 =
  "inline-block align-middle h-10 min-h-10 max-h-10 w-10 min-w-10 max-w-10 rounded-lg";
export const THUMB_50 =
  "inline-block align-middle h-12.5 min-h-12.5 max-h-12.5 w-12.5 min-w-12.5 max-w-12.5 rounded-lg";
export const THUMB_75 =
  "inline-block align-middle h-18.75 min-h-18.75 max-h-18.75 w-18.75 min-w-18.75 max-w-18.75 rounded-lg";
export const AVATAR_35 =
  "h-8.75 min-h-8.75 max-h-8.75 w-8.75 min-w-8.75 max-w-8.75 rounded-lg";

export const BTN_ICON_VIEW =
  "me-2 inline-flex items-center justify-center size-8 p-0! [&_i]:text-base [&_i]:leading-4";
export const BTN_ICON =
  "inline-flex items-center justify-center size-8 p-0! [&_i]:text-base [&_i]:leading-4";
export const BTN_ICON_LG =
  "inline-flex items-center justify-center size-10 p-0! [&_i]:text-[1.15rem] [&_i]:leading-4.6";

/** Red helper text under an invalid field. */
export const FIELD_ERROR = "block w-full mt-1 text-[0.875em] text-danger";

/** Restores prose spacing for admin-authored HTML rendered with dangerouslySetInnerHTML (preflight resets it). */
export const RICH_CONTENT =
  "[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-8 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-8 [&_img]:inline [&_img]:max-w-none [&_img]:align-middle";
