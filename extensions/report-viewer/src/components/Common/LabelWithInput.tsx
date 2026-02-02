import React from "react";
import { FormikErrors, FormikTouched } from "formik";
import classNames from "classnames";

interface OwnProps {
  label: string;
  value: string;
  onChange: any;
  placeholder?: string;
  width?: string | number;
  errorText?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
  type?: React.HTMLInputTypeAttribute;
  touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  theme?: "dark" | "light";
}

type Props = OwnProps;

const LabelWithInput: React.FC<Props> = ({
  label,
  onChange,
  value,
  placeholder = "",
  errorText,
  touched,
  type,
  theme = "light",
}) => {
  return (
    <div className="flex flex-col">
      <h4
        className={classNames(
          "text-base font-normal text-black  mb-[6px]",
          theme === "dark" ? "text-white" : "text-black",
        )}
      >
        {label}
      </h4>
      <div>
        <input
          className="text-base font-normal w-full text-black px-2 py-[5px] bg-white border border-[#DEE2E6] outline-none rounded-[6px]"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {touched && errorText !== undefined && String(errorText)?.length > 0 && (
        <span className="text-xs text-red-600">{String(errorText)}</span>
      )}
    </div>
  );
};

export default LabelWithInput;
