import { cn } from "@/utils/cn";

const part = (tag, base) => {
  const Tag = tag;
  const Part = ({ className, ...props }) => <Tag className={cn(base, className)} {...props} />;
  Part.displayName = `Card.${tag}`;
  return Part;
};

function Card({ className, ...props }) {
  return (
    <div
      className={cn("relative flex min-w-0 flex-col rounded-xl border border-line bg-surface shadow-card break-words", className)}
      {...props}
    />
  );
}

Card.Header = part("div", "rounded-t-xl border-b border-line bg-surface px-6 py-4 max-[400px]:p-4");
Card.Body = part("div", "flex-auto p-6 max-[400px]:p-4 has-[[data-table]]:p-0 has-[[data-table]]:[&_[data-pagination]]:p-4 has-[[data-table]]:[&_[data-table]]:rounded-none has-[[data-table]]:[&_[data-table]]:border-0 has-[[data-table]]:[&_[data-table]]:shadow-none");
Card.Footer = part("div", "rounded-b-xl border-t border-line bg-surface p-5 max-[400px]:p-4");
Card.Title = part("div", "mb-2 text-[15px] leading-[1.3] font-semibold");
Card.Text = part("p", "mb-4 last:mb-0");

export default Card;
