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
    fontSize?: range12Type | string;
}

interface StyledIconProps extends IconComponentProps {
    $fontSize?: range12Type | string;
}

const StyledCustomIcon = styled(Icon)<StyledIconProps>`
    ${({ $fontSize }) => {
        const rangeSize = theme.default.spaces[$fontSize];
        return `
        font-size: ${typeof $fontSize === "string" ? $fontSize : getREM(rangeSize)};
        `;
    }}
    &:focus {
        outline-color: ${({ theme }) => theme.default.primaryColor};
    }
`;
const CustomIcon = ({ icon, fontSize, ...props }: CustomIconProps) => {
    return <StyledCustomIcon $fontSize={fontSize} component={icon} {...props} />;
};
export default CustomIcon;
