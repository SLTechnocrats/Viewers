import  { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Props = {
    label?:string;
    value ? : Dayjs | null ;
    onChange ? : (arg : Dayjs | null) => void;
}

const CustomTimePicker = (props: Props) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker  {...props} label={props.label} value={props.value} onChange={props.onChange} />
        </LocalizationProvider>
    )
}

export default CustomTimePicker