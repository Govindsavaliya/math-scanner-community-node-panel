import Icon from "@/components/ui/Icon";
export default function ScrollToTopButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to top"
      className="fixed right-6 bottom-6 z-1050 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-[var(--font-white)] shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0a6cc2] hover:shadow-[0_6px_14px_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--font-white)"
    >
      <Icon name="chevron-up" />
    </button>
  );
}
