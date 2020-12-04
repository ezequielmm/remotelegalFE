import React from "react";
import { TextAreaProps } from "antd/lib/input/TextArea";
import { StyledTextArea } from "./styles";

export interface ITextAreaProps extends TextAreaProps {
    invalid?: boolean;
}

const TextArea = (props: ITextAreaProps) => {
    const { invalid, ...rest } = props;
    const isInvalid = rest.disabled ? false : invalid;

    return <StyledTextArea {...rest} invalid={isInvalid} />;
};

export default TextArea;
