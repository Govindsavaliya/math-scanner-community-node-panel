import Switch from "react-switch";

const LABEL = "flex justify-center text-[12px] leading-7 font-semibold text-white";

/** ON/OFF toggle used for every status column and form field (green = on, gray = off). */
export default function StatusSwitch({ checked, onChange, disabled }) {
  return (
    <Switch
      onChange={onChange}
      checked={checked}
      disabled={disabled}
      offColor="#94a3b8"
      onColor="#16a34a"
      height={28}
      width={64}
      aria-label={checked ? "Active, click to deactivate" : "Inactive, click to activate"}
      uncheckedIcon={<div className={`${LABEL} mr-1`}>OFF</div>}
      checkedIcon={<div className={`${LABEL} ml-1`}>ON</div>}
    />
  );
}
