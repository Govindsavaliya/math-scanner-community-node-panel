import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { flatNav } from "@/config/navigation";
import { cn } from "@/utils/cn";

/** Wraps the matching part of `text` in <mark>. */
function Highlight({ text, query }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-primary/15 text-inherit">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

/** Ctrl/Cmd + K page switcher: type to filter pages, arrows to move, Enter to open, Escape to close. */
export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? flatNav.filter((item) => `${item.label} ${item.section}`.toLowerCase().includes(q)) : flatNav;
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    setQuery("");
    setActive(0);
    onClose();
  };

  const go = (item) => {
    close();
    navigate(item.to);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") close();
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[active]) go(results[active]);
  };

  // Group results by section while keeping a flat index for keyboard navigation.
  const groups = [];
  results.forEach((item, index) => {
    let group = groups.find((g) => g.title === item.section);
    if (!group) groups.push((group = { title: item.section, items: [] }));
    group.items.push({ item, index });
  });

  return createPortal(
    <div className="fixed inset-0 z-1100 flex items-start justify-center bg-black/40 px-4 pt-[12vh]" onMouseDown={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search pages"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-140 overflow-hidden rounded-[14px] border border-line bg-surface shadow-modal"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" size={18} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search pages..."
            aria-label="Search pages"
            className="h-12 flex-1 border-0 bg-transparent text-[14px] text-ink outline-0 placeholder:text-muted"
          />
          <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted">Esc</kbd>
        </div>
        <div className="max-h-90 overflow-y-auto p-2">
          {results.length === 0 && <p className="px-3 py-8 text-center text-[13px] text-muted">No pages found</p>}
          {groups.map((group) => (
            <div key={group.title} className="mb-1">
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-muted uppercase">{group.title}</p>
              {group.items.map(({ item, index }) => (
                <button
                  key={item.to}
                  type="button"
                  onMouseMove={() => setActive(index)}
                  onClick={() => go(item)}
                  className={cn(
                    "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg border-0 px-3 text-left text-[14px] text-ink",
                    index === active ? "bg-primary/10 text-primary" : "bg-transparent",
                  )}
                >
                  <Icon name={item.icon} size={16} className="shrink-0" />
                  <span className="flex-1 truncate">
                    <Highlight text={item.label} query={query.trim()} />
                  </span>
                  {index === active && <Icon name="forward" size={14} />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
