import SelectPicker from "rsuite/SelectPicker";
import { STATUS } from "@/config/constants";
import { FILTER_SELECT } from "@/features/ui-classes";
import { cn } from "@/utils/cn";

/** All / Active / Inactive / Deleted filter shared by every list (see `statusParam` for the API value). */
export default function StatusFilter({ value, onChange, className }) {
  return (
    <SelectPicker
      container={() => document.body}
      cleanable={false}
      searchable={false}
      data={STATUS}
      value={value}
      onChange={onChange}
      className={cn(FILTER_SELECT, "font-normal", className)}
      placeholder="Select Status"
      placement="bottomEnd"
      aria-label="Filter by status"
    />
  );
}
