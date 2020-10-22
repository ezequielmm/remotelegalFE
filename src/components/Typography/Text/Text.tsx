import React from "react";

import styled from "styled-components";
import { getREM, getWeightNumber } from "../../../constants/styles/utils";

export interface ITextProps {
    size?: "small" | "default" | "large";
    weight?: "light" | "regular" | "bold";
    uppercase?: boolean;
    ellipsis?: boolean;
    state?: "error" | "warning" | "success" | "info" | "primary" | "secondary" | undefined;
    children: string;
}

const StyledText = styled.span<ITextProps>`
    ${({ size, weight, state, uppercase, ellipsis, theme }) => {
        const { textColor, fontSizes } = theme.default;

        const fontSize = (textSize, sizes) => {
            let value = "0";

            switch (textSize) {
                case "small":
                    value = getREM(sizes[8]);
                    break;

                case "large":
                    value = getREM(sizes[6]);
                    break;

                default:
                    value = getREM(sizes[7]);
                    break;
            }

            return value;
        };

        const stateStyle = state ? `color: ${theme.default[`${state}Color`]};` : "";

        const uppercaseStyle = uppercase ? `text-transform: uppercase;` : "";

        const ellipsisStyle = ellipsis
            ? `
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-wrap: normal;
            max-width: 100%;
            display: inline-block;
            vertical-align: top;
            `
            : "";

        const styles = `
            color: ${textColor};
            font-size: ${fontSize(size, fontSizes)};
            font-weight: ${weight ? getWeightNumber(weight) : 400};
            line-height: 1.5;
            ${stateStyle}
            ${uppercaseStyle}
            ${ellipsisStyle}
        `;

        return styles;
    }}
`;

const text = ({ size, weight, state, uppercase = false, ellipsis = true, children }: ITextProps) => {
    return (
        <StyledText size={size} weight={weight} state={state} uppercase={uppercase} ellipsis={ellipsis}>
            {children}
        </StyledText>
    );
};

export default text;
