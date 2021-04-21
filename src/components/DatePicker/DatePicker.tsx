import React from "react";
import { DatePicker as AntDatePicker } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/lib/date-picker";
import Icon from "../Icon";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { StyledPopupContainer, StyledDatePicker, StyledRangePicker } from "./styles";

export type IDatePickerProps = DatePickerProps & {
    invalid?: boolean;
};

const DatePicker = ({ ...props }: IDatePickerProps) => (
    <StyledPopupContainer>
        <StyledDatePicker
            getPopupContainer={(trigger) => trigger.parentElement}
            suffixIcon={<Icon size={9} icon={CalendarIcon} />}
            {...props}
        />
    </StyledPopupContainer>
);

DatePicker.RangePicker = ({ ...props }: RangePickerProps) => (
    <StyledPopupContainer>
        <StyledRangePicker
            as={AntDatePicker.RangePicker}
            getPopupContainer={(trigger) => trigger.parentElement}
            suffixIcon={<Icon size={9} icon={CalendarIcon} />}
            {...props}
        />
    </StyledPopupContainer>
);
export default DatePicker;
