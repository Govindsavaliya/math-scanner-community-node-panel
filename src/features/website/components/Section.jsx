import { cn } from "@/utils/cn";

const BASE =
  "scroll-mt-20 py-12.5 max-lg:py-11.25 max-md:py-10 max-sm:py-8.75 max-[400px]:py-7.5 max-[320px]:py-6.25";

/** Landing page `<section>` with the shared vertical rhythm. */
export default function Section({ id, className, children }) {
  return (
    <section id={id} className={cn(BASE, className)}>
      {children}
    </section>
  );
}
