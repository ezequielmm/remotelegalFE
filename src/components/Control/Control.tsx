import React from "react";
import { ButtonProps, ButtonType } from "antd/lib/button";
import Text from "../Typography/Text";
import { StyledRoundedControl, StyledCircleControl, StyledRoundedButton } from "./styles";
import ColorStatus from "../../types/ColorStatus";

export enum Types {
    CIRCLE = "circle",
    ROUNDED = "rounded",
    SIMPLE = "simple",
}

export type ButtonTypeExtended = ButtonType | "secondary";

export interface IButtonProps extends Omit<ButtonProps, "type" | "children"> {
    type: "circle" | "rounded" | "simple";
    isToggled?: boolean;
    label?: string;
    color?: "blue" | "red";
}

export default function Control({ isToggled, type, label, icon, color, size, ...rest }: IButtonProps) {
    let Button;

    if (type === Types.CIRCLE) {
        Button = StyledCircleControl;
    } else if (type === Types.ROUNDED) {
        Button = StyledRoundedControl;
    } else if (type === Types.SIMPLE) {
        Button = StyledRoundedButton;
    }

    return (
        <Button {...rest} color={color} isToggled={isToggled}>
            {icon}
            {label && (
                <Text size="small" state={isToggled && color !== "red" ? ColorStatus.primary : ColorStatus.white}>
                    {label}
                </Text>
            )}
        </Button>
    );
}
