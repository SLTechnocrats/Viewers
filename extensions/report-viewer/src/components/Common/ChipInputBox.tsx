import classNames from "classnames";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import trashIcon from "@/assets/svg/trash.svg";
import "./ChipInputBox.css";
import chevronDownIcon from "@/assets/svg/chevron-down.svg";
interface ChipInputProps {
  label?: string;
  width?: string;
  items?: string[];
  onChange?: (arg: string[]) => void;
  icon: any;
}

const ChipInputBox: FunctionComponent<ChipInputProps> = ({
  label = "Placeholder",
  width,
  items = reportTypes,
  onChange,
}) => {
  const [chips, setChips] = useState(new Set<string>());
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    36,
  );

  const addToSet = (value: string) => {
    // Use the set's 'add' method to add a value
    const newSet = new Set(chips);
    newSet.add(value);
    setChips(newSet);
  };

  const removeFromSet = (value: string) => {
    // Use the set's 'delete' method to remove a value
    const newSet = new Set(chips);
    newSet.delete(value);
    setChips(newSet);
  };

  const chipDropDownChange = (str: string) => {
    str === "none" ? setChips(new Set<string>()) : addToSet(str);
  };

  const [show, setShow] = useState(false);

  const closeDropdown = () => {
    setShow(false);
  };
  const ref = useDetectClickOutside({ onTriggered: closeDropdown });

  const refForHeight: React.LegacyRef<HTMLDivElement> = useRef(null);

  useEffect(() => {
    setContainerHeight(refForHeight.current?.offsetHeight);
  });

  return (
    <div
      onClick={() => setShow(!show)}
      className="flex flex-col w-min relative "
    >
      <div
        ref={refForHeight}
        style={{ width: `${width}px` }}
        className={classNames(
          "w-[200px] h-full border border-[#DEE2E6] justify-between px-2 py-1 min-h-[36px] cursor-pointer rounded-[6px] flex items-start",
        )}
      >
        <div className="text-[16px] font-normal  h-full mt-0.5 text-[#ADB5BD] leading-[20px] min-w-max">
          {chips.size
            ? [...chips].map((item: string, index) => {
                return (
                  <div
                    className="flex items-center gap-x-[6px] py-1 px-1.5 bg-[#CFE2FF] rounded-[20px] w-fit"
                    key={index}
                  >
                    <span className="text-sm font-normal text-[#212529]">
                      {item}
                    </span>
                    <img
                      onClick={() => {
                        removeFromSet(item);
                        onChange?.([...chips]);
                      }}
                      src={trashIcon}
                    />
                  </div>
                );
              })
            : label}
        </div>

        <img src={chevronDownIcon} className="mt-1" />
      </div>
      {show && (
        <div
          ref={ref}
          style={{ marginTop: `${containerHeight}px` }}
          className="absolute z-50 mt-10"
        >
          <Dropdown
            onChange={(str) => {
              chipDropDownChange(str);
              onChange?.([...chips]);
            }}
            items={items}
            width={width}
          />
        </div>
      )}
    </div>
  );
};

const Dropdown = ({
  width = "200",
  items,
  onChange,
}: {
  width?: string;
  items?: string[];
  onChange?: (arg: string) => void;
}) => {
  return (
    <div
      style={{ width: `${width}px` }}
      className="border border-[#DEE2E6] bg-white p-1 overflow-y-auto  rounded-[6px] h-52"
    >
      <div
        onClick={() => onChange?.("none")}
        className="w-full text-center text-base font-normal rounded-sm text-[#ADB5BD] hover:bg-gray-100  py-1.5 cursor-pointer"
      >
        none
      </div>
      {items?.map((item, i) => {
        return (
          <div
            key={i}
            onClick={() => onChange?.(item)}
            className="w-full text-center text-base font-normal rounded-sm text-[#ADB5BD] hover:bg-gray-100  py-1.5 cursor-pointer"
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

export default ChipInputBox;

const reportTypes = [
  "Sales Report",
  "Financial Statement",
  "Customer Feedback",
  "Inventory Status",
  "Project Update",
  "Employee Performance",
  "Market Analysis",
  "Expense Summary",
  "Quality Assurance",
  "Productivity Metrics",
];
