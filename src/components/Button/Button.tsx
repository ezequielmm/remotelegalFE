import React from "react";
import { Button as AntButton } from "antd";
import { ButtonProps, ButtonType } from "antd/lib/button/button";

import styled from "styled-components";

export type ButtonTypeExtended = ButtonType | "secondary";

export interface IButtonProps extends Omit<ButtonProps, "type"> {
    type?: ButtonTypeExtended;
}

const buttonDefault = ({ children, type, ...rest }: IButtonProps) => {
    const defaultType = type === "secondary" ? "primary" : type;

    return (
        <AntButton type={defaultType} {...rest}>
            {children}
        </AntButton>
    );
};

const StyledButton = styled(buttonDefault)<IButtonProps>`
    ${({ type, theme }) => {
        const secondaryColor = theme.colors.secondary;
        const textColor = theme.default.textColorInverse;

        return (
            type === "secondary" &&
            `
            background: ${secondaryColor[5]};
            border-color: ${secondaryColor[5]};
            color: ${textColor};

            &:hover,
            &:focus {
                background: ${secondaryColor[4]};
                border-color: ${secondaryColor[4]};
                color: ${textColor};
            }

            &:active {
                background: ${secondaryColor[6]};
                border-color: ${secondaryColor[6]};
                color: ${textColor};
            }
            `
        );
    }}
`;

const button = ({ children, ...rest }: IButtonProps) => {
    return <StyledButton {...rest}>{children}</StyledButton>;
};

export default button;
