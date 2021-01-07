import Icon from "@ant-design/icons";
import React from "react";
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";
import styled from "styled-components";
interface CustomIconProps
    extends Pick<
        IconComponentProps,
        "component" | "style" | "spin" | "rotate" | "className" | "height" | "width" | "onClick" | "tabIndex"
    > {
    icon: React.ComponentType;
}
const StyledCustomIcon = styled(Icon)<IconComponentProps>`
    &:focus {
        outline-color: ${({ theme }) => theme.default.primaryColor};
    }
`;
const CustomIcon = ({ icon, ...props }: CustomIconProps) => <StyledCustomIcon component={icon} {...props} />;
export default CustomIcon;
