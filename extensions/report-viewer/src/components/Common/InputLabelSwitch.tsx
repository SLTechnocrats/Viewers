import React, { useState } from "react";
import { Switch } from "@headlessui/react";

interface InputLabelSwitchProps {
  label: string;
  value?: string;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
}

const InputLabelSwitch: React.FC<InputLabelSwitchProps> = ({
  label,
  onChange,
  value,
  placeholder = "Placeholder",
  width,
}) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex flex-col">
      <h4 className="text-base font-normal text-black mb-[6px]">{label}</h4>
      <div className="flex gap-x-4">
        <div className="flex items-center text-base font-normal gap-x-1 text-black">
          <span>No</span>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
              enabled ? "bg-[#75B798]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${
                enabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span>Yes</span>
        </div>
        <input
          style={{ width: `${width}px` }}
          className="text-base font-normal text-black px-2 py-[5px] bg-white border border-[#DEE2E6] outline-none rounded-[6px]"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputLabelSwitch;
