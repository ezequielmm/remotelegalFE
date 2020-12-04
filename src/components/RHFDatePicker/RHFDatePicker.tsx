import { DatePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import React from "react";
import { Control } from "react-hook-form";
import { DATE_FORMAT } from "../../constants/createDeposition";
import DatePicker from "../DatePicker";
import RHFWrapper from "../RHFWrapper";

interface RHFDatePickerProps {
    control: Control<any>;
    defaultValue?: string;
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
                    defaultValue={typeof defaultValue === "string" ? moment(new Date(defaultValue)) : defaultValue}
                    format={DATE_FORMAT}
                    placeholder={placeholder}
                    name={inputName}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={typeof value === "string" ? moment(new Date(value)) : value}
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
