import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Space, Tooltip } from "antd";
import { Control, Controller } from "react-hook-form";
import Text from "../Typography/Text";
import { InputSpacing } from "./styles";

export interface RHFWrapperProps {
    component?: (data: {
        onChange: (...event: any[]) => void;
        onBlur: () => void;
        value: any;
        name: string;
        ref: React.MutableRefObject<any>;
    }) => React.ReactElement<
        any,
        | string
        | ((
              props: any
          ) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null)
        | (new (props: any) => React.Component<any, any, any>)
    >;
    defaultValue?: object | string;
    control: Control<any>;
    errorMessage?: string;
    name: string;
    infoToolTip?: string;
    label?: React.ReactNode;
    noMargin?: boolean;
}

export default function RHFWrapper({
    component,
    defaultValue,
    control,
    errorMessage,
    infoToolTip,
    name,
    label,
    noMargin = false,
}: RHFWrapperProps) {
    return (
        <Form.Item
            style={noMargin && { marginBottom: 0 }}
            label={
                <Space>
                    {label}
                    {!!infoToolTip && (
                        <Tooltip title={infoToolTip}>
                            <InfoCircleOutlined />
                        </Tooltip>
                    )}
                </Space>
            }
            htmlFor={name}
        >
            <InputSpacing>
                <Controller defaultValue={defaultValue} control={control} name={name} render={component} />
                <Text block height={1} size="small" state="error">
                    {errorMessage}
                </Text>
            </InputSpacing>
        </Form.Item>
    );
}
