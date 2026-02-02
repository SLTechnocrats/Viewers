import React from "react";
import { Switch } from "@headlessui/react";
import { FormikErrors } from "formik";
interface OwnProps {
  label: string;
  value: boolean;
  setValue: () => unknown;
  errorText:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
}

type Props = OwnProps;

const SwitchInput: React.FC<Props> = ({
  label,
  value,
  setValue,
  errorText,
}) => {
  const _classes = `${value ? "bg-[#75B798]" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full`;
  const _span = `${value ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`;
  return (
    <div className="flex flex-col">
      <h4 className="text-base font-normal text-black mb-[6px]">{label}</h4>
      <div className="flex gap-x-4">
        <div className="flex items-center text-base font-normal gap-x-1 text-black">
          <span>No</span>
          <Switch checked={value} onChange={setValue} className={_classes}>
            <span className="sr-only">{label}</span>
            <span className={_span} />
          </Switch>
          <span>Yes</span>
        </div>
      </div>
      {errorText && (
        <span className="text-xs text-red-600">{String(errorText)}</span>
      )}
    </div>
  );
};

export default SwitchInput;
