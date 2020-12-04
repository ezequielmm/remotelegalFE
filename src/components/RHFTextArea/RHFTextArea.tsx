import React from "react";
import { TextAreaProps } from "antd/lib/input";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import TextArea from "../TextArea";

interface RHFTextAreaProps extends RHFWrapperProps {
    placeholder?: string;
    defaultValue?: string;
    textAreaProps?: TextAreaProps;
}

export default function RHFTextArea({ placeholder, textAreaProps, ...wrapperProps }: RHFTextAreaProps) {
    return (
        <RHFWrapper
            component={({ name: inputName, onChange, onBlur, value }) => (
                <TextArea
                    placeholder={placeholder}
                    defaultValue={wrapperProps.defaultValue}
                    name={inputName}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={!!wrapperProps.errorMessage}
                    {...textAreaProps}
                />
            )}
            {...wrapperProps}
        />
    );
}
