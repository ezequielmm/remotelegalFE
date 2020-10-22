import React from "react";
import { InputProps } from "antd/lib/input/Input";
import { StyledInput } from "./styles";

export interface IInputProps extends InputProps {
    invalid?: boolean;
}

const input = (props: IInputProps) => {
    const { invalid, ...rest } = props;
    const isInvalid = rest.disabled ? false : invalid;

    return <StyledInput {...rest} invalid={isInvalid} />;
};

export default input;
