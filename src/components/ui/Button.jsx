import { cn } from "@/utils/cn";

const BASE =
  "cursor-pointer select-none text-center align-middle font-medium no-underline shadow-xs transition duration-150 focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-65";

// Full literal class strings so Tailwind can detect them.
const VARIANTS = {
  primary: "border border-primary-solid bg-primary-solid text-white hover:border-primary-solid-hover hover:bg-primary-solid-hover",
  secondary: "border border-line bg-canvas text-ink hover:bg-line",
  light: "border border-canvas bg-canvas text-ink",
  danger: "border border-danger bg-danger text-white",
  success: "border border-success bg-success text-white",
  info: "border border-info bg-info text-white",
  warning: "border border-warning bg-warning text-white",
  link: "border border-transparent bg-transparent text-primary underline hover:text-primary-hover",
  "outline-primary": "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
  "outline-secondary": "border border-line bg-surface text-ink hover:bg-canvas",
  "outline-danger": "border border-danger bg-transparent text-danger hover:bg-danger hover:text-white",
  "outline-success": "border border-success bg-transparent text-success hover:bg-success hover:text-white",
  "outline-warning": "border border-warning bg-transparent text-warning hover:bg-warning hover:text-white",
  "outline-info": "border border-info bg-transparent text-info hover:bg-info hover:text-white",
  ghost: "border border-transparent bg-transparent text-muted hover:bg-surface-2 hover:text-ink",
  bare: "border-0",
};

const SIZES = {
  md: "inline-block rounded-lg px-4 py-2 text-[14.5px]",
  sm: "inline-block rounded-md px-2 py-1.628 text-[0.875rem]",
  lg: "inline-block rounded-lg px-5 py-2.5 text-[1.1rem]",
  icon: "inline-flex size-8 items-center justify-center rounded-lg p-2 [&_i]:text-base [&_i]:leading-4",
  "icon-sm": "inline-flex size-8 items-center justify-center rounded-md p-2 [&_i]:text-base [&_i]:leading-4",
  "icon-lg":
    "inline-flex size-10 items-center justify-center rounded-lg p-2 [&_i]:text-[1.15rem] [&_i]:leading-4.6",
  none: "",
};

/**
 * @param {"primary"|"secondary"|"light"|"danger"|"success"|"info"|"warning"|"link"|"bare"|string} [variant]
 *        Prefix with "outline-" for outlined buttons. "bare" has no border, colours or padding.
 * @param {"sm"|"lg"|"icon"|"icon-sm"|"icon-lg"|"none"} [size]  Default is the regular button.
 */
export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      {...(Component === "button" ? { type } : {})}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}
