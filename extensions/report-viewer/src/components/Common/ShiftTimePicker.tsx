import dayjs, { Dayjs } from "dayjs";
import CustomTimePicker from "../Common/CustomTimePicker";
import { useEffect, useState } from "react";

type Props = {
    value: string; // The time range as a single string, e.g., "10:00 AM to 12:00 PM"
    onChange: (value: string) => void; // onChange expects a string in the same format
};

const ShiftTimePicker = ({ value, onChange }: Props) => {
    // Local state for start and end time strings
    const [startTimeStr, setStartTimeStr] = useState<string>("");
    const [endTimeStr, setEndTimeStr] = useState<string>("");

    useEffect(() => {
        // Split the initial value and set it to state
        const [initialStartTime, initialEndTime] = value.split(" to ");
        setStartTimeStr(initialStartTime || "");
        setEndTimeStr(initialEndTime || "");
    }, [value]);

    const handleStartTimeChange = (newStartTime: Dayjs | null) => {
        const formattedStartTime = newStartTime ? newStartTime.format("h:mm A") : "";
        setStartTimeStr(formattedStartTime);
        onChange(`${formattedStartTime} to ${endTimeStr}`);
    };

    const handleEndTimeChange = (newEndTime: Dayjs | null) => {
        const formattedEndTime = newEndTime ? newEndTime.format("h:mm A") : "";
        setEndTimeStr(formattedEndTime);
        onChange(`${startTimeStr} to ${formattedEndTime}`);
    };

    return (
        <div className="flex items-center gap-x-5">
            <CustomTimePicker value={startTimeStr ? dayjs(startTimeStr, "h:mm A") : null} onChange={handleStartTimeChange} />
            <CustomTimePicker value={endTimeStr ? dayjs(endTimeStr, "h:mm A") : null} onChange={handleEndTimeChange} />
        </div>
    );
};

export default ShiftTimePicker;
