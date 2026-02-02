import React, { useState } from "react";
import Datepicker, { DateType } from "react-tailwindcss-datepicker";
import calendarIcon from "@/assets/svg/calendar.svg";
import { XMarkIcon as ClearIcon } from "@heroicons/react/16/solid";

interface Props {
    value: { startDate: DateType, endDate: DateType };
    setValue: (params: any) => void;
    popoverDirection?: "up" | "down";
}

const DateRangePicker: React.FC<Props> = ({ value, setValue, popoverDirection = "down" }) => {

    const [open,setOpen] = useState(false)

    const handleValueChange = (newValue: any) => {
        setValue(newValue);
    };


    return (
        <div onClick={()=>setOpen(true)} className="w-full border border-[#DEE2E6] rounded-[6px] relative">
            <Datepicker
                popupClassName={open ? "transition-all ease-out duration-300 max-h-[60vh] overflow-y-auto lg:max-h-auto lg:overflow-visible absolute z-10 mt-[1px] text-sm lg:text-xs 2xl:text-sm mb-2.5 mt-2.5 block translate-y-0 opacity-1" : ""}
                popoverDirection={popoverDirection}
                containerClassName="relative"
                inputClassName="h-[36px] pl-4 text-sm font-normal text-[#ADB5BD] w-full outline-none rounded-[6px] lg:h-[40px] lg:pl-6 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Date Range"
                toggleIcon={(open: boolean) => {
                    return open ? (
                        <img src={calendarIcon} alt="Date Range Picker" />
                    ) : (
                        <ClearIcon className="h-5 w-5 text-gray-500" />
                    );
                }}
                value={value}
                onChange={handleValueChange}
                displayFormat={"DD/MM/YYYY"}
            />
        </div>
    );
};

export default DateRangePicker;
