import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Tooltip } from "antd";
import { Control, Controller } from "react-hook-form";
import Space from "../Space";
import Text from "../Typography/Text";
import { InputSpacing } from "./styles";
import ColorStatus from "../../types/ColorStatus";

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
            style={{ marginBottom: noMargin && 0, width: "100%" }}
            label={
                <Space>
                    <span>{label}</span>
                    {!!infoToolTip && (
                        <Tooltip data-testid="tooltip" title={infoToolTip}>
                            <InfoCircleOutlined />
                        </Tooltip>
                    )}
                </Space>
            }
            htmlFor={name}
        >
            <InputSpacing>
                <Controller defaultValue={defaultValue} control={control} name={name} render={component} />
                <Text dataTestId={errorMessage} block height={1} size="small" state={ColorStatus.error}>
                    {errorMessage}
                </Text>
            </InputSpacing>
        </Form.Item>
    );
}
