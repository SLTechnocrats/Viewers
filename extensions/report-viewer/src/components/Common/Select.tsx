import React from "react";
import chevronDownIcon from "@/assets/svg/chevron-down.svg";

interface Props {
  label: string;
  onChange: (arg: string) => void;
  options: any[];
}

const Select: React.FC<Props> = ({ label, onChange, options = [] }) => {
  return (
    <div className="w-full border bg-white border-[#DEE2E6] rounded-[6px] flex relative items-center">
      <select
        style={{ WebkitAppearance: "none" }}
        className="bg-white outline-none w-full text-[#ADB5BD] pl-4 h-[36px] text-base font-normal rounded-[6px]"
        onChange={(e) => onChange?.(e.target.value)}
        defaultValue={""}
      >
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((item, i) => {
          return (
            <option key={i} value={item}>
              {item}
            </option>
          );
        })}
      </select>
      <img className="absolute right-0 mr-4" src={chevronDownIcon} alt="" />
    </div>
  );
};
export default Select;
