import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import Icon from "./Icon";

const SIZES = {
  sm: "sm:max-w-75",
  lg: "lg:max-w-200",
  xl: "lg:max-w-200",
};

/**
 * @param {boolean} show
 * @param {() => void} onHide
 * @param {"sm"|"lg"|"xl"} [size]
 */
function Modal({ show, onHide, size, children }) {
  useEffect(() => {
    if (!show) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onHide?.();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [show, onHide]);

  if (!show) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-1055 overflow-x-hidden overflow-y-auto outline-0"
        role="dialog"
        tabIndex={-1}
        onMouseDown={(e) => e.target === e.currentTarget && onHide?.()}
      >
        <div
          className={cn(
            "pointer-events-none relative m-2 w-auto sm:mx-auto sm:my-7 sm:max-w-125",
            size && SIZES[size],
          )}
        >
          <div className="pointer-events-auto relative flex w-full flex-col rounded-[14px] border border-line bg-surface shadow-modal outline-0">
            {children}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-1050 bg-slate-950/60 backdrop-blur-[2px]" />
    </>,
    document.body,
  );
}

function Header({ closeButton, onHide, children, className }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between rounded-t-[14px] border-b border-line p-4",
        className,
      )}
    >
      {children}
      {closeButton && (
        <button
          type="button"
          aria-label="Close"
          onClick={onHide}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <Icon name="x" size={18} />
        </button>
      )}
    </div>
  );
}

const part = (name, base) => {
  const Part = ({ className, ...props }) => <div className={cn(base, className)} {...props} />;
  Part.displayName = name;
  return Part;
};

Modal.Header = Header;
Modal.Title = part("Modal.Title", "mb-0 text-[16px] leading-normal font-semibold");
Modal.Body = part("Modal.Body", "relative flex-auto p-4");
Modal.Footer = part(
  "Modal.Footer",
  "flex shrink-0 flex-wrap items-center justify-end gap-2 rounded-b-[14px] border-t border-line p-4",
);

export default Modal;
