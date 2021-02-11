import React from "react";
import styled from "styled-components";
import { Divider as AntDivider } from "antd";
import { DividerProps } from "antd/lib/divider";
import { ThemeMode } from "../../types/ThemeType";
import { getREM } from "../../constants/styles/utils";

export interface IDividerProps extends DividerProps {
    fitContent?: boolean;
    hasMargin?: boolean;
}

const StyledDivider = styled(AntDivider).withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) =>
        !["hasMargin", "fitContent"].includes(prop) && defaultValidatorFn(prop),
})<IDividerProps>`
    ${({ type, fitContent, hasMargin, theme }) => {
        const fitContentStyles = type === "vertical" ? "height: 100%;" : "width: 100%;";

        const inDepoStyles = theme.mode === ThemeMode.inDepo ? `border-color: ${theme.colors.disabled[7]};` : "";

        const marginStyles = hasMargin ? `margin: 0 ${getREM(theme.default.spaces[3])};` : "margin: 0;";

        const styles = `
            ${marginStyles}
            ${fitContent ? fitContentStyles : ""}
            ${inDepoStyles}
            top: unset;
            left: unset;
        `;

        return styles;
    }}
`;

const Divider = ({ hasMargin = true, ...rest }: IDividerProps) => {
    return <StyledDivider hasMargin={hasMargin} {...rest} />;
};

export default Divider;
