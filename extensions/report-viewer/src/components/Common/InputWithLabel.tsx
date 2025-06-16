import React from "react";
import { FormikErrors, FormikTouched } from "formik";

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
}

type Props = OwnProps;

const InputWithLabel: React.FC<Props> = ({
  label,
  onChange,
  value,
  placeholder = "",
  width,
  errorText,
  touched,
  type,
}) => {
  return (
    <div className="flex flex-col">
      <h4 className="text-base font-normal text-black mb-[6px]">{label}</h4>
      <div>
        <input
          style={{ width: `${width}px` }}
          className="text-base font-normal text-black px-2 py-[5px] bg-white border border-[#DEE2E6] outline-none rounded-[6px]"
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

export default InputWithLabel;
