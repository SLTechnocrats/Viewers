import { FunctionComponent } from "react";
import SelectBox from "./ChipInputBox";
import chevronDownIcon from "@/assets/svg/chevron-down.svg";

interface SelectBoxWithLabelProps {
  label: string;
  placeholder: string;
  width?: string;
}

const SelectBoxWithLabel: FunctionComponent<SelectBoxWithLabelProps> = ({
  label,
  placeholder,
  width,
}) => {
  return (
    <div className="flex flex-col">
      <h4 className="text-base font-normal text-black mb-[6px]">{label}</h4>
      <div>
        <SelectBox icon={chevronDownIcon} width={width} label={placeholder} />
      </div>
    </div>
  );
};

export default SelectBoxWithLabel;
