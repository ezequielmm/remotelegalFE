import React from "react";
import { Button as AntButton } from "antd";
import { ButtonProps, ButtonType } from "antd/lib/button/button";

import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";

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
    ${({ size, type, icon, theme }) => {
        const { textColorInverse, fontSizes } = theme.default;
        const { primary, secondary, disabled } = theme.colors;
        const buttonSizeStyle =
            size === "middle"
                ? `
                font-size: ${getREM(fontSizes[8])};
                `
                : ``;
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
                        color: ${theme.mode === ThemeMode.inDepo ? disabled[9] : primary[2]};
                        border-color: ${theme.mode === ThemeMode.inDepo ? disabled[9] : primary[2]};
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

        const iconStyle = icon
            ? `
                display: flex;
                align-items: center;
            `
            : "";

        const styles = `
            text-transform: uppercase;
            text-shadow: none;
            min-width: auto;
            ${typeLinkStyle}
            ${typeSecondaryStyle}
            ${typeTextStyle}
            ${buttonSizeStyle}
            ${typeGhostStyle}
            ${iconStyle}
            `;

        return styles;
    }}
`;

const button = ({ children, size = "large", ...rest }: IButtonProps) => {
    return (
        <StyledButton size={size} {...rest}>
            {children}
        </StyledButton>
    );
};

export default button;
