import { cn } from "@/utils/cn";

export const FIELD =
  "peer block min-h-10 w-full appearance-none rounded-lg border bg-surface px-3 py-1.5 text-[15px] leading-normal font-normal text-ink shadow-xs transition duration-150 placeholder:text-muted/60 focus:ring-4 focus:ring-primary/15 focus:outline-0 dark:disabled:bg-white/5";
export const FILE =
  "[&[type=file]]:overflow-hidden file:pointer-events-none file:-my-1.5 file:-ms-3 file:me-3 file:h-10 file:rounded-md file:border-0 file:bg-canvas file:px-3 file:py-1.5 file:text-ink";
// Border colour is chosen here (not in FIELD) so the invalid colour never competes with the focus colour.
export const VALID_BORDER =
  "border-line focus:border-primary [.was-validated_&:invalid]:border-danger";
export const INVALID_BORDER = "border-danger";
/** Text-field look, also usable on non-input elements (e.g. the date-range box). */
export const controlClasses = cn(FIELD, FILE, VALID_BORDER);
