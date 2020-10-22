import React from "react";
import { Button as AntButton } from "antd";
import { ButtonProps, ButtonType } from "antd/lib/button/button";

import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

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
        const { textColor, fontSizes } = theme.default;
        const { secondary } = theme.colors;

        const typeSecondaryStyle =
            type === "secondary"
                ? `
                background: ${secondary[5]};
                border-color: ${secondary[5]};
                color: ${textColor};

                &:hover,
                &:focus {
                    background: ${secondary[4]};
                    border-color: ${secondary[4]};
                    color: ${textColor};
                }

                &:active {
                    background: ${secondary[6]};
                    border-color: ${secondary[6]};
                    color: ${textColor};
                }
                `
                : "";

        const typeLinkStyle =
            type === "link"
                ? `
                text-transform: unset;
                padding: 0;
                line-height: inherit;
                min-width: 0;
                height: unset;
                &::first-letter {
                    text-transform: uppercase;
                }
                `
                : "";

        const styles = `
            min-width: ${getREM(9.375)};
            font-size: ${getREM(fontSizes[7])};
            line-height: 2;
            text-transform: uppercase;
            ${typeLinkStyle}
            ${typeSecondaryStyle}
            `;

        return styles;
    }}
`;

const button = ({ children, ...rest }: IButtonProps) => {
    return <StyledButton {...rest}>{children}</StyledButton>;
};

export default button;
