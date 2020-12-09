import React from "react";
import { CheckboxOptionType } from "antd/lib/checkbox";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import RadioGroup from "../RadioGroup";

interface RHFRadioButtonProps extends RHFWrapperProps {
    disabled?: boolean;
    options: Array<CheckboxOptionType | string>;
    setValue: <TFieldName extends string>(
        name: TFieldName,
        value: any,
        options?: Partial<{
            shouldValidate: boolean;
            shouldDirty: boolean;
        }>
    ) => void;
}

export default function RHFRadioButton({ disabled, options, setValue, ...wrapperProps }: RHFRadioButtonProps) {
    return (
        <RHFWrapper
            component={({ name, value }) => (
                <RadioGroup
                    defaultValue={wrapperProps.defaultValue}
                    disabled={disabled}
                    options={options}
                    onChange={async (ev) => setValue(name, ev?.target?.value, { shouldValidate: true })}
                    value={value}
                />
            )}
            {...wrapperProps}
        />
    );
}
