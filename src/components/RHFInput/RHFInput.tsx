import React from "react";
import Input from "../Input";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";

interface RHFInputProps extends RHFWrapperProps {
    placeholder?: string;
    defaultValue?: string;
}

export default function RHFInput({ placeholder, ...wrapperProps }: RHFInputProps) {
    return (
        <RHFWrapper
            component={({ name: inputName, onChange, onBlur, value }) => (
                <Input
                    placeholder={placeholder}
                    defaultValue={wrapperProps.defaultValue}
                    name={inputName}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={!!wrapperProps.errorMessage}
                />
            )}
            {...wrapperProps}
        />
    );
}
