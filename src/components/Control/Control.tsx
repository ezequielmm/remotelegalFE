import React from "react";
import { ButtonProps, ButtonType } from "antd/lib/button";
import Text from "../Typography/Text";
import { StyledRoundedControl, StyledCircleControl, StyledRoundedControlInRed, StyledRoundedButton } from "./styles";

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

export default function Control({ isToggled, type, label, icon, color, ...rest }: IButtonProps) {
    let Button;

    if (type === Types.CIRCLE) {
        Button = StyledCircleControl;
    } else if (type === Types.ROUNDED) {
        Button = StyledRoundedControl;
        if (color === "red") {
            Button = StyledRoundedControlInRed;
        }
    } else if (type === Types.SIMPLE) {
        Button = StyledRoundedButton;
    }

    return (
        <Button {...rest} isToggled={isToggled}>
            {icon}
            {label && (
                <Text size="small" state={isToggled && color !== "red" ? "primary" : "white"}>
                    {label}
                </Text>
            )}
        </Button>
    );
}
