import React from "react";
import Select, { StylesConfig } from "react-select";
import { FormikErrors, FormikTouched } from "formik";
import Colors from "@/theme/Colors";

interface OwnProps {
  label: string;
  value: any;
  width: number;
  setValue: (val: any) => void;
  options: { label: string; value: any; color: string }[];
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

const MultiSelectBox: React.FC<Props> = ({
  label,
  value,
  width,
  setValue,
  options,
  errorText,
  touched,
}) => {
  const selectStyles: StylesConfig<
    { label: string; value: string; color: string },
    true
  > = {
    option: (baseStyles) => {
      return {
        ...baseStyles,
        color: "black",
      };
    },
    container: (baseStyles) => {
      return {
        ...baseStyles,
        width: `${width}px`,
        backgroundColor: Colors.white,
      };
    },
    singleValue: (baseStyle) => {
      return {
        ...baseStyle,
        paddingLeft: "10px",
        paddingRight: "10px",
      };
    },
  };

  return (
    <div className="flex flex-col">
      <h4 className="text-base font-normal text-black mb-[6px]">{label}</h4>
      <div>
        <Select
          defaultValue={{ label: "Select", value: "", color: "black" }}
          value={value}
          styles={selectStyles}
          onChange={(item) => setValue(item)}
          options={options}
          className="text-base font-normal text-black bg-white"
          isMulti={true}
        />
      </div>
      {touched && errorText !== undefined && String(errorText)?.length > 0 && (
        <span className="text-xs text-red-600">{String(errorText)}</span>
      )}
    </div>
  );
};

export default MultiSelectBox;
