import React from "react";
import { DatePickerProps, RangePickerProps } from "../GenerateDatePicker/interfaces/interfaces";
import Icon from "../Icon";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-right.svg";
import { StyledPopupContainer, StyledDatePicker, StyledRangePicker } from "./styles";
import { theme } from "../../constants/styles/theme";

const DatePicker = ({ ...props }: DatePickerProps) => (
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
            getPopupContainer={(trigger) => trigger.parentElement}
            suffixIcon={<Icon size={9} icon={CalendarIcon} />}
            separator={<Icon size={5} icon={ArrowIcon} color={theme.colors.disabled[7]} />}
            {...props}
        />
    </StyledPopupContainer>
);
export default DatePicker;
