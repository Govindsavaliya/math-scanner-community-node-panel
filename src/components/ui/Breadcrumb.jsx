import { cn } from "@/utils/cn";

function Breadcrumb({ className, children, ...props }) {
  return (
    <nav aria-label="breadcrumb" className={className} {...props}>
      <ol className="m-0 flex list-none flex-wrap p-0">{children}</ol>
    </nav>
  );
}

function Item({ active, className, ...props }) {
  return (
    <li
      className={cn(
        "[&:not(:first-child)]:pl-2 [&:not(:first-child)]:before:float-left [&:not(:first-child)]:before:pr-2 [&:not(:first-child)]:before:text-[#6c757d] [&:not(:first-child)]:before:content-['/']",
        active && "text-primary",
        className,
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    />
  );
}

Breadcrumb.Item = Item;

export default Breadcrumb;
