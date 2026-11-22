import Icon from "@/components/ui/Icon";
import RcPagination from "rc-pagination";
import { cn } from "@/utils/cn";

const ARROW =
  "flex size-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-[20px] text-ink hover:bg-canvas";

// rc-pagination renders the <li> items itself, so they are styled through child selectors on the <ul>.
const LIST =
  "m-0 flex list-none items-center justify-center gap-1.5 p-0 text-[14px] font-medium [&_a]:text-inherit [&_a]:no-underline [&>li]:flex [&>li]:size-9 [&>li]:cursor-pointer [&>li]:items-center [&>li]:justify-center [&>li]:rounded-lg [&>li]:text-ink [&>li]:transition-colors [&>li.rc-pagination-item:hover]:bg-primary/10 [&>li.rc-pagination-item:hover]:text-primary [&>li.rc-pagination-item-active]:bg-primary [&>li.rc-pagination-item-active]:text-white [&>li.rc-pagination-item-active:hover]:bg-primary [&>li.rc-pagination-item-active:hover]:text-white";

const makeItemRender = (current, lastPage) => (_page, type, originalElement) => {
  if (type === "prev") {
    return (
      <button type="button" className={cn(ARROW, current === 1 && "pointer-events-none opacity-40")} aria-label="Previous">
        <Icon name="back" />
      </button>
    );
  }
  if (type === "next") {
    return (
      <button type="button" className={cn(ARROW, current === lastPage && "pointer-events-none opacity-40")} aria-label="Next">
        <Icon name="forward" />
      </button>
    );
  }
  if (type === "jump-prev" || type === "jump-next") {
    return (
      <button type="button" className="size-10 cursor-pointer border-0 bg-transparent text-[14px] text-ink">
        •••
      </button>
    );
  }
  return originalElement;
};

/** Renders nothing when everything fits on a single page. */
export default function Pagination({ current, total, pageSize, onChange, className }) {
  if (total <= pageSize) return null;
  return (
    <div data-pagination className={cn("mt-6", className)}>
      <RcPagination
        className={LIST}
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        showTitle={false}
        itemRender={makeItemRender(current, Math.ceil(total / pageSize))}
      />
    </div>
  );
}
