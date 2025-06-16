import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
interface InputProps {
  placeholder?: string;
  style?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[];
  type?: React.HTMLInputTypeAttribute;
}

const PasswordInput: React.FC<InputProps> = ({
  placeholder,
  style,
  onChange,
  value,
  type,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={style}
      className="w-full flex justify-between items-center  h-[2.75rem] px-3 text-base font-normal rounded-[8px] border border-[#CACED8]"
    >
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={showPassword ? "text" : type}
        className=" outline-none bg-none"
      />
      {type === "password" &&
        (showPassword ? (
          <button onClick={() => setShowPassword(!showPassword)}>
            <EyeIcon className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={() => setShowPassword(!showPassword)}>
            <EyeSlashIcon className="w-5 h-5" />
          </button>
        ))}
    </div>
  );
};

export default PasswordInput;
