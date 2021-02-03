import Icon from "@ant-design/icons";
import React from "react";
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";

const range12 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
type range12Type = typeof range12[number];

interface CustomIconProps
    extends Pick<
        IconComponentProps,
        "component" | "style" | "spin" | "rotate" | "className" | "height" | "width" | "onClick" | "tabIndex"
    > {
    icon: React.ComponentType;
    size?: range12Type | string;
}

interface StyledIconProps extends IconComponentProps {
    $size?: range12Type | string;
}

const StyledCustomIcon = styled(Icon)<StyledIconProps>`
    ${({ $size }) => {
        const rangeSize = theme.default.spaces[$size];
        return `
        font-size: ${typeof $size === "string" ? $size : getREM(rangeSize)};
        `;
    }}
    &:focus {
        outline-color: ${({ theme }) => theme.default.primaryColor};
    }
`;
const CustomIcon = ({ icon, size, ...props }: CustomIconProps) => {
    return <StyledCustomIcon $size={size} component={icon} {...props} />;
};
export default CustomIcon;
