import React from "react";

import styled from "styled-components";
import { getREM, getWeightNumber } from "../../../constants/styles/utils";

export interface ITextProps {
    size?: "small" | "default" | "large";
    weight?: "light" | "regular" | "bold";
    uppercase?: boolean;
    ellipsis?: boolean;
    block?: boolean;
    state?: "primary" | "secondary" | "disabled" | "error" | "warning" | "success" | "info" | undefined;
    children: string;
}

const StyledText = styled.span<ITextProps>`
    ${({ size, weight, state, uppercase, ellipsis, block, theme }) => {
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
            vertical-align: top;
            `
            : "";

        const displayStyle = block ? `display: block;` : `display: inline-block;`;

        const styles = `
            color: ${textColor};
            font-size: ${fontSize(size, fontSizes)};
            font-weight: ${weight ? getWeightNumber(weight) : 400};
            line-height: 1.5;
            ${stateStyle}
            ${uppercaseStyle}
            ${ellipsisStyle}
            ${displayStyle}
        `;

        return styles;
    }}
`;

const text = ({ size, weight, state, uppercase = false, ellipsis = true, block = false, children }: ITextProps) => {
    return (
        <StyledText size={size} weight={weight} state={state} uppercase={uppercase} ellipsis={ellipsis} block={block}>
            {children}
        </StyledText>
    );
};

export default text;
