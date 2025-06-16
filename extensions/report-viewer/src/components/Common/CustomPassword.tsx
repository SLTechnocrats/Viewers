import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface InputProps {
  type?: React.HTMLInputTypeAttribute;
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value?: string | number | readonly string[];
}
const CustomPassword: React.FC<InputProps> = ({
  type,
  label,
  onChange,
  name,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="rounded-md px-3 flex flex-col justify-center border border-gray-300 bg-gray-50 w-[25.625rem] h-[3.75rem]">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="w-full flex justify-between items-center h-[1.5rem]">
        <input
          value={value}
          name={name}
          onChange={onChange}
          className="text-black  text-lg outline-none !bg-gray-50"
          type={showPassword ? "text" : type}
        />
        {type === "password" && (
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-black" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-black" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomPassword;
