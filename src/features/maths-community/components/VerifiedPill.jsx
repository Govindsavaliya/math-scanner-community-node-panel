import Icon from "@/components/ui/Icon";
/** Green "Right Answer" badge pinned to the top-right corner of a card body. */
export default function VerifiedPill({ title }) {
  return (
    <div
      title={title}
      className="absolute top-3 right-3 inline-flex cursor-default items-center rounded-full bg-success/10 px-3.5 py-1.5 text-[13px] font-medium text-success backdrop-blur-[6px] transition-all duration-[250ms] hover:bg-success/20 [&_i]:text-[18px]"
    >
      <Icon name="badge" className="me-2" />
      <span>Right Answer</span>
    </div>
  );
}
