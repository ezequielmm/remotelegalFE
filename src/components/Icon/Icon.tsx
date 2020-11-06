import Icon from "@ant-design/icons";
import React from "react";

import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";

interface CustomIconProps
    extends Pick<IconComponentProps, "component" | "style" | "spin" | "rotate" | "className" | "height" | "width"> {
    icon: React.ComponentType;
}
const CustomIcon = ({ icon, ...props }: CustomIconProps) => <Icon component={icon} {...props} />;
export default CustomIcon;
