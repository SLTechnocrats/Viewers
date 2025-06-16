import React from "react";
interface CustomInputProps {
  value: string;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

const CustomInput: React.FC<CustomInputProps> = ({
  onChange,
  value,
  placeholder = "Choose file",
  type = "text",
}) => {
  return (
    <input
      type={type}
      className="w-full text-base font-normal text-black px-2 py-[5px] bg-white border border-[#DEE2E6] outline-none rounded-[6px]"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default CustomInput;
