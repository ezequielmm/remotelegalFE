import React from "react";
import { Badge as AntDBadge } from "antd";
import { BadgeProps } from "antd/lib/badge";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";
import ColorStatus from "../../types/ColorStatus";

export interface IBadgeProps extends Omit<BadgeProps, "color"> {
    rounded?: boolean;
    children?: React.ReactChild;
    color?: ColorStatus;
}

const badgeDefault = ({ rounded, color, count, dot, ...rest }: IBadgeProps) => {
    const defaultDot = count ? false : dot;

    return <AntDBadge dot={defaultDot} count={count} {...rest} />;
};

const StyledBadge = styled(badgeDefault)<IBadgeProps>`
    ${({ theme, size, rounded, color, count, dot }) => {
        const colorStyle = color
            ? `
                background-color: ${theme.default[`${ColorStatus[color]}Color`]};
                color: ${theme.default.whiteColor};
            `
            : ``;

        const roundedStyle = rounded
            ? `
                border-radius: 9999px;
            `
            : `
                border-radius: ${getREM(theme.default.spaces[2])};
            `;

        const badgeSize =
            size === "small"
                ? `
                    font-size: ${getREM(theme.default.spaces[3] + theme.default.spaces[1])};
                    min-width: ${getREM(theme.default.spaces[6])};
                    min-height: ${getREM(theme.default.spaces[6])};
                `
                : `
                    min-width: ${getREM(theme.default.spaces[10])};
                    height: ${getREM(theme.default.spaces[10])};
                    line-height: ${getREM(theme.default.spaces[10])};
                    font-size: ${getREM(theme.default.fontSizes[6])};
                `;

        const inDepoTheme =
            theme.mode === ThemeMode.inDepo
                ? `
                background-color: ${theme.colors.inDepoNeutrals[7]}; 
                color: ${theme.colors.inDepoNeutrals[8]};
                box-shadow: 0 0 0 2px ${theme.colors.inDepoNeutrals[3]};
            `
                : `
                background-color: ${theme.colors.primary[5]};
            `;

        const styles = `
            .ant-badge-count, .ant-badge-dot {
                ${
                    count
                        ? `
                            min-width: ${getREM(theme.default.spaces[9])};
                            ${badgeSize}
                        `
                        : ""
                }
                ${count ? roundedStyle : ""}
                ${inDepoTheme}
                ${colorStyle}
            }
            .ant-badge-dot.ant-badge-count-sm {
                min-width: 6px;
                min-height: 6px;
            }
        `;
        return styles;
    }}
`;

const badge = ({ children, dot = true, ...rest }: IBadgeProps) => (
    <StyledBadge dot={dot} {...rest}>
        {children}
    </StyledBadge>
);
export default badge;
