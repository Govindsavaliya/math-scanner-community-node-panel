import { cn } from "@/utils/cn";

/*
 * 12-column responsive grid. Class names are written out in full (not built
 * from template strings) so Tailwind can detect them.
 */
const WIDTH = {
  xs: ["w-1/12", "w-2/12", "w-3/12", "w-4/12", "w-5/12", "w-6/12", "w-7/12", "w-8/12", "w-9/12", "w-10/12", "w-11/12", "w-full"],
  sm: ["sm:w-1/12", "sm:w-2/12", "sm:w-3/12", "sm:w-4/12", "sm:w-5/12", "sm:w-6/12", "sm:w-7/12", "sm:w-8/12", "sm:w-9/12", "sm:w-10/12", "sm:w-11/12", "sm:w-full"],
  md: ["md:w-1/12", "md:w-2/12", "md:w-3/12", "md:w-4/12", "md:w-5/12", "md:w-6/12", "md:w-7/12", "md:w-8/12", "md:w-9/12", "md:w-10/12", "md:w-11/12", "md:w-full"],
  lg: ["lg:w-1/12", "lg:w-2/12", "lg:w-3/12", "lg:w-4/12", "lg:w-5/12", "lg:w-6/12", "lg:w-7/12", "lg:w-8/12", "lg:w-9/12", "lg:w-10/12", "lg:w-11/12", "lg:w-full"],
  xl: ["xl:w-1/12", "xl:w-2/12", "xl:w-3/12", "xl:w-4/12", "xl:w-5/12", "xl:w-6/12", "xl:w-7/12", "xl:w-8/12", "xl:w-9/12", "xl:w-10/12", "xl:w-11/12", "xl:w-full"],
  xxl: ["2xl:w-1/12", "2xl:w-2/12", "2xl:w-3/12", "2xl:w-4/12", "2xl:w-5/12", "2xl:w-6/12", "2xl:w-7/12", "2xl:w-8/12", "2xl:w-9/12", "2xl:w-10/12", "2xl:w-11/12", "2xl:w-full"],
};
const BREAKPOINTS = Object.keys(WIDTH);

/** Gutter presets (horizontal / vertical gap in rem, Bootstrap-compatible). */
const GUTTER = {
  0: "[--gx:0rem] [--gy:0rem]",
  3: "[--gx:1rem] [--gy:1rem]",
  4: "[--gx:1.5rem] [--gy:1.5rem]",
};
const GUTTER_SM = { 4: "sm:[--gx:1.5rem] sm:[--gy:1.5rem]" };

/**
 * @param {0|3|4} [gutter]    Gutter at all sizes.
 * @param {4} [gutterSm]      Gutter from the `sm` breakpoint up.
 */
export function Row({ gutter, gutterSm, className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-wrap -mt-(--gy) -mx-[calc(var(--gx)/2)]",
        // default gutter only when none is given (CSS order made the 1.5rem default beat gutter 0)
        gutter === undefined ? "[--gx:1.5rem] [--gy:0rem]" : GUTTER[gutter],
        gutterSm !== undefined && GUTTER_SM[gutterSm],
        className,
      )}
      {...props}
    />
  );
}

/** Column - pass a span (1-12 or `true`/"auto" for equal width) per breakpoint. */
export function Col({ className, ...props }) {
  const classes = [];
  const rest = { ...props };
  for (const bp of BREAKPOINTS) {
    const span = rest[bp];
    delete rest[bp];
    if (span) classes.push(WIDTH[bp][Number(span) - 1]);
  }
  if (!props.xs) classes.unshift("w-full");
  return (
    <div
      className={cn("shrink-0 max-w-full px-[calc(var(--gx)/2)] mt-(--gy)", classes, className)}
      {...rest}
    />
  );
}

export function Container({ fluid, className, ...props }) {
  return (
    <div
      className={cn(
        "w-full px-3 mx-auto",
        !fluid && "sm:max-w-135 md:max-w-180 lg:max-w-240 xl:max-w-285 2xl:max-w-330",
        className,
      )}
      {...props}
    />
  );
}
