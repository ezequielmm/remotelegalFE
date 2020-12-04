import React from "react";
import { CheckboxOptionType } from "antd/lib/checkbox";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import RadioGroup from "../RadioGroup";

interface RHFRadioButtonProps extends RHFWrapperProps {
    disabled?: boolean;
    options: Array<CheckboxOptionType | string>;
}

export default function RHFRadioButton({ disabled, options, ...wrapperProps }: RHFRadioButtonProps) {
    return (
        <RHFWrapper
            component={({ onChange, value }) => (
                <RadioGroup
                    fullWidth
                    defaultValue={wrapperProps.defaultValue}
                    disabled={disabled}
                    options={options}
                    onChange={(ev) => onChange(ev?.target?.value)}
                    value={value}
                />
            )}
            {...wrapperProps}
        />
    );
}
