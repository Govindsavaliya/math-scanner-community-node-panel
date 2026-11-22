import Icon from "@/components/ui/Icon";
import { Form } from "@/components/ui";
import { cn } from "@/utils/cn";

export default function SearchInput({
  name,
  id,
  value,
  placeholder,
  className = "",
  wrapperClassName = "w-full sm:w-auto",
  onChange,
  onSearch,
  loading = false,
  disabled = false,
  ariaLabel,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.();
    }
  };

  const handleIconClick = (event) => {
    event.preventDefault();
    if (disabled || loading) return;
    onSearch?.();
  };

  return (
    <div className={cn("relative", wrapperClassName)} role="search">
      <Form.Control
        type="text"
        name={name}
        id={id}
        value={value}
        placeholder={placeholder}
        className={cn("pr-11", className)}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-muted transition-colors hover:bg-surface-2 hover:text-primary focus-visible:text-primary peer-focus:text-primary disabled:pointer-events-none disabled:opacity-65"
        onClick={handleIconClick}
        aria-label={ariaLabel || "Search"}
        disabled={disabled || loading}
      >
        <Icon name="search" size={16} />
      </button>
    </div>
  );
}
