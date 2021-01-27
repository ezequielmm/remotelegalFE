import React from "react";
import { Badge as AntDBadge } from "antd";
import { BadgeProps } from "antd/lib/badge";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";

export type BadgeSizeExtended = BadgeProps["size"] | "large";

export interface IBadgeProps extends Omit<BadgeProps, "size"> {
    size?: BadgeSizeExtended;
}

const badgeDefault = ({ size, ...rest }: IBadgeProps) => {
    const defaultSize = size === "large" ? "default" : size;

    return <AntDBadge size={defaultSize} {...rest} />;
};

const StyledBadge = styled(badgeDefault)<IBadgeProps>`
    ${({ theme, size }) => {
        const inDepoTheme =
            theme.mode === ThemeMode.inDepo
                ? `
                background-color: ${theme.colors.inDepoNeutrals[7]}; 
                color: ${theme.colors.inDepoNeutrals[8]};
                box-shadow: none;
            `
                : `
                background-color: ${theme.colors.primary[5]};
            `;

        const badgeSize =
            size === "small"
                ? `
                    font-size: ${getREM(theme.default.fontSizes[9])};
                    min-width: ${getREM(theme.default.spaces[7])};
                `
                : `
                    min-width: ${getREM(theme.default.spaces[10])};
                    height: ${getREM(theme.default.spaces[10])};
                    line-height: ${getREM(theme.default.spaces[10])};
                    font-size: ${getREM(theme.default.fontSizes[6])};
                `;

        const styles = `
            .ant-badge-count {
                border-radius: ${getREM(theme.default.spaces[2])};
                min-width: ${getREM(theme.default.spaces[9])};
                ${badgeSize}
                ${inDepoTheme}
            }
        `;
        return styles;
    }}
`;

const badge = ({ ...rest }: IBadgeProps) => <StyledBadge {...rest} />;
export default badge;
