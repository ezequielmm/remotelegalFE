import { SelectProps } from "antd/lib/select";
import React from "react";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import Select from "../Select";

interface RHFSelectProps extends RHFWrapperProps {
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    renderUnselectableOption?: () => React.ReactNode;
    renderItem?: (item) => React.ReactNode;
    filter?: SelectProps<any>["filterOption"];
    dataTestId?: string;
    items: Record<string, any>;
}

export default function RHFSelect({
    disabled,
    loading,
    items,
    filter,
    placeholder,
    renderUnselectableOption,
    renderItem,
    dataTestId,
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
                    data-testid={dataTestId}
                    defaultValue={wrapperProps.defaultValue}
                    disabled={disabled}
                    loading={loading}
                    placeholder={placeholder}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={!!wrapperProps.errorMessage}
                    showSearch={!!filter}
                    optionFilterProp="children"
                    filterOption={filter}
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
