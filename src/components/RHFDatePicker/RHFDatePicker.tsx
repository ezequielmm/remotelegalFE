import { Dayjs } from "dayjs";
import React from "react";
import { Control } from "react-hook-form";
import { DATE_FORMAT } from "../../constants/createDeposition";
import DatePicker from "../DatePicker";
import { DatePickerProps } from "../GenerateDatePicker/interfaces/interfaces";
import RHFWrapper from "../RHFWrapper";

interface RHFDatePickerProps {
    control: Control<any>;
    defaultValue?: Dayjs;
    name: string;
    errorMessage?: string;
    label?: React.ReactNode;
    placeholder?: string;
    datePickerProps?: DatePickerProps;
}

export default function RHFDatePicker({
    control,
    defaultValue,
    errorMessage,
    label,
    name,
    placeholder,
    datePickerProps,
}: RHFDatePickerProps) {
    return (
        <RHFWrapper
            component={({ name: inputName, onChange, onBlur, value }) => (
                <DatePicker
                    data-testid="date_picker"
                    defaultValue={defaultValue}
                    format={DATE_FORMAT}
                    placeholder={placeholder}
                    name={inputName}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={!!errorMessage}
                    {...datePickerProps}
                />
            )}
            control={control}
            defaultValue={defaultValue}
            errorMessage={errorMessage}
            name={name}
            label={label}
        />
    );
}
