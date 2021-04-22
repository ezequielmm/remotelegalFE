import { SelectProps } from "antd/lib/select";
import React, { Dispatch, SetStateAction } from "react";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import Select from "../Select";

interface RHFSelectProps extends RHFWrapperProps {
    disabled?: boolean;
    customInvalid?: boolean;
    controlledValue?: string;
    filterChange?: (value: string) => void;
    loading?: boolean;
    placeholder?: string;
    renderUnselectableOption?: () => React.ReactNode;
    renderItem?: (item) => React.ReactNode;
    filter?: SelectProps<any>["filterOption"];
    dataTestId?: string;
    items: Record<string, any>;
    controlledOnChange?: Dispatch<SetStateAction<string>>;
    controlledOnBlur?: () => void;
    afteScrollRender?: React.ReactNode;
}

export default function RHFSelect({
    disabled,
    loading,
    customInvalid,
    controlledOnChange,
    controlledValue,
    items,
    filter,
    filterChange,
    placeholder,
    renderUnselectableOption,
    renderItem,
    dataTestId,
    controlledOnBlur,
    afteScrollRender,
    ...wrapperProps
}: RHFSelectProps) {
    if (items.length && typeof items[0] === "object" && !renderItem) {
        console.error("renderItem must be defined when items are object");
        return null;
    }

    return (
        <RHFWrapper
            component={({ onChange, onBlur, value }) => (
                <Select
                    defaultValue={wrapperProps.defaultValue}
                    onSearch={filterChange}
                    data-testid={dataTestId}
                    disabled={disabled}
                    loading={loading}
                    placeholder={placeholder}
                    onBlur={() => {
                        if (controlledOnBlur) {
                            return controlledOnBlur();
                        }
                        return onBlur();
                    }}
                    onChange={(val: string) => {
                        if (controlledOnChange) {
                            return controlledOnChange(val);
                        }
                        return onChange(val);
                    }}
                    value={controlledValue || value}
                    invalid={customInvalid || !!wrapperProps.errorMessage}
                    showSearch={!!filter}
                    optionFilterProp="children"
                    filterOption={filter}
                    dropdownRender={(menu) => (
                        <div>
                            {menu} {afteScrollRender}
                        </div>
                    )}
                >
                    {items.map((item) =>
                        typeof item === "string" ? (
                            <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        ) : (
                            renderItem(item)
                        )
                    )}
                    {renderUnselectableOption && (
                        <Select.Option disabled value="unselectable">
                            {renderUnselectableOption()}
                        </Select.Option>
                    )}
                </Select>
            )}
            {...wrapperProps}
        />
    );
}
