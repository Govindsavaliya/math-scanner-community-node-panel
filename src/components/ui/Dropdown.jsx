import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import Button from "./Button";

const DropdownContext = createContext({ open: false, toggle: () => {}, close: () => {} });

/** Click-to-open menu that closes on outside click, Escape or item selection. */
function Dropdown({ className, children, ...props }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, toggle, close }}>
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function Toggle({ variant = "primary", noCaret = false, className, ...props }) {
  const { open, toggle } = useContext(DropdownContext);
  return (
    <Button
      variant={variant}
      aria-expanded={open}
      onClick={toggle}
      className={cn(
        "whitespace-nowrap",
        !noCaret &&
          "after:ml-[0.255em] after:inline-block after:border-x-[0.3em] after:border-t-[0.3em] after:border-b-0 after:border-x-transparent after:align-[0.255em] after:content-['']",
        className,
      )}
      {...props}
    />
  );
}

function Menu({ align, className, ...props }) {
  const { open } = useContext(DropdownContext);
  return (
    <div
      className={cn(
        "absolute top-full z-1000 m-0 min-w-54.5 list-none rounded-xl border border-line bg-surface p-1.5 text-left shadow-dropdown",
        align === "end" ? "right-0" : "left-0",
        open ? "block" : "hidden",
        className,
      )}
      {...props}
    />
  );
}

function Item({ onClick, className, ...props }) {
  const { close } = useContext(DropdownContext);
  return (
    <a
      href="#"
      role="button"
      className={cn(
        "block w-full rounded-lg bg-transparent px-3 py-2 text-start text-[14px] font-medium whitespace-nowrap text-ink hover:bg-surface-2 hover:text-ink focus:bg-surface-2",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        close();
      }}
      {...props}
    />
  );
}

Dropdown.Toggle = Toggle;
Dropdown.Menu = Menu;
Dropdown.Item = Item;

export default Dropdown;
