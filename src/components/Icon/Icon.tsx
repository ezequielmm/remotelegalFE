import ANTIcon from "@ant-design/icons";
import React from "react";
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import ColorStatus, { isColorStatusType } from "../../types/ColorStatus";

const range12 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
type range12Type = typeof range12[number];

export interface IIconProps
    extends Pick<
        IconComponentProps,
        "component" | "style" | "spin" | "rotate" | "className" | "height" | "width" | "onClick" | "tabIndex"
    > {
    icon: React.ComponentType;
    size?: range12Type | string;
    color?: ColorStatus | string;
}

interface StyledIconProps extends IconComponentProps {
    $size?: range12Type | string;
    $color?: ColorStatus | string;
}

const StyledIcon = styled(ANTIcon)<StyledIconProps>`
    ${({ $size, $color, theme }) => {
        const rangeSize = theme.default.spaces[$size];

        const colorStyles = $color
            ? `
                color: ${isColorStatusType($color) ? theme.default[`${$color}Color`] : $color};
            `
            : "";

        const sizeStyles = $size
            ? `
                font-size: ${typeof $size === "string" ? $size : getREM(rangeSize)};
            `
            : "";

        return `
            .anticon&& {
                ${colorStyles}
                ${sizeStyles}
                line-height: 0;
    
                &:focus {
                    outline-color: ${theme.default.primaryColor};
                }
            }
        `;
    }}
`;
const Icon = ({ icon, size, color, ...props }: IIconProps) => {
    return <StyledIcon $size={size} $color={color} component={icon} {...props} />;
};
export default Icon;
