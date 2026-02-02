import React from "react";
import { FormikErrors, FormikTouched } from "formik";
import PasswordInput from "./PasswordInput";

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

const LabelPasswordInput: React.FC<Props> = (props) => {
  const { width, label, errorText, touched } = props;
  return (
    <div className="flex flex-col">
      <h4 className="text-base font-normal text-black mb-[6px]">{label}</h4>
      <div>
        <PasswordInput style={{ width: `${width}px` }} {...props} />
      </div>
      {touched && errorText !== undefined && String(errorText)?.length > 0 && (
        <span className="text-xs text-red-600">{String(errorText)}</span>
      )}
    </div>
  );
};

export default LabelPasswordInput;
