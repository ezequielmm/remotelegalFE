import {
    RangePickerProps as AntDRangePickerProps,
    PickerDateProps,
    PickerTimeProps,
} from "antd/lib/date-picker/generatePicker";
import { Dayjs } from "dayjs";

export interface DatePickerProps extends Omit<PickerDateProps<Dayjs>, "picker"> {
    invalid?: boolean;
}

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, "picker"> {
    invalid?: boolean;
}

export interface RangePickerProps extends Omit<AntDRangePickerProps<Dayjs>, "picker"> {
    invalid?: boolean;
}
