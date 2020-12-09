import React from "react";
import { Button as AntButton } from "antd";
import { ButtonProps, ButtonType } from "antd/lib/button/button";

import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

export type ButtonTypeExtended = ButtonType | "secondary";

export interface IButtonProps extends Omit<ButtonProps, "type"> {
    type?: ButtonTypeExtended;
    width?: string;
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
    ${({ size, type, width, theme }) => {
        const { textColorInverse, fontSizes, spaces } = theme.default;
        const { primary, secondary } = theme.colors;

        const smallButtonStyle =
            size === "small"
                ? `
                    font-size: ${getREM(fontSizes[4] / 2)};
                    padding: ${getREM(spaces[2] / 2)} ${getREM(spaces[2])};
                    min-width: auto;
                    height: ${getREM(spaces[7])};
                    border-radius: ${getREM(spaces[1])};
                    line-height: 1.2;
                `
                : "";

        const typeSecondaryStyle =
            type === "secondary"
                ? `
                background: ${secondary[5]};
                border-color: ${secondary[5]};
                color: ${textColorInverse}; // TODO get contrast and return white or black text

                &:hover,
                &:focus {
                    background: ${secondary[4]};
                    border-color: ${secondary[4]};
                    color: ${textColorInverse}; // TODO get contrast and return white or black text
                }

                &:active {
                    background: ${secondary[6]};
                    border-color: ${secondary[6]};
                    color: ${textColorInverse}; // TODO get contrast and return white or black text
                }
                `
                : "";

        const typeGhostStyle =
            type === "ghost"
                ? `
                    color: ${primary[5]};
                    border-color: ${primary[5]};

                    &[disabled],
                    &[disabled]:hover {
                        color: ${primary[2]};
                        border-color: ${primary[2]};
                        background-color: transparent;
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

        const typeTextStyle =
            type === "text"
                ? `
                color: ${primary[5]};
                min-width: unset;

                &:hover,
                &:active {
                    color: ${primary[4]};
                }
                
                &:focus {
                    color: ${primary[6]};
                }

                &:hover span,
                &:active span {
                    text-decoration: underline;
                }
                &:hover,
                &:active,
                &:focus {
                    background: transparent;
                }
                `
                : "";

        const styles = `
            min-width: ${String(width) || getREM(9.375)};
            font-size: ${getREM(fontSizes[7])};
            line-height: 2;
            text-transform: uppercase;
            text-shadow: none;
            ${typeLinkStyle}
            ${typeSecondaryStyle}
            ${typeTextStyle}
            ${smallButtonStyle}
            ${typeGhostStyle}
            `;

        return styles;
    }}
`;

const button = ({ children, ...rest }: IButtonProps) => {
    return <StyledButton {...rest}>{children}</StyledButton>;
};

export default button;
