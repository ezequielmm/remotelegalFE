import { ButtonProps, ButtonType } from "antd/lib/button";
import Text from "prp-components-library/src/components/Text";
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
    isActive?: boolean;
    label?: string;
    color?: "blue" | "red";
}

export default function Control({ isActive, type, label, icon, color, size, ...rest }: IButtonProps) {
    let Button;

    if (type === Types.CIRCLE) {
        Button = StyledCircleControl;
    } else if (type === Types.ROUNDED) {
        Button = StyledRoundedControl;
    } else if (type === Types.SIMPLE) {
        Button = StyledRoundedButton;
    }

    return (
        <Button color={color} isActive={isActive} {...rest}>
            {icon}
            {label && (
                <Text size="small" state={isActive && color !== "red" ? ColorStatus.primary : ColorStatus.white}>
                    {label}
                </Text>
            )}
        </Button>
    );
}
