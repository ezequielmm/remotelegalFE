import React from "react";

import styled from "styled-components";
import { getREM, getWeightNumber } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";

export interface ITextProps {
    height?: number;
    size?: "small" | "default" | "large" | "extralarge";
    weight?: "light" | "regular" | "bold";
    uppercase?: boolean;
    ellipsis?: boolean;
    block?: boolean;
    align?: "center" | "right";
    state?: ColorStatus;
    font?: "default" | "header" | "code";
    dataTestId?: string;
    children: React.ReactChild;
}

const StyledText = styled.span<ITextProps>`
    ${({ height, size, weight, state, uppercase, ellipsis, block, font, align, theme }) => {
        const { textColor, fontSizes, fontFamilies, headerFontFamilies, codeFontFamily } = theme.default;

        const setFontSize = (textSize, sizes) => {
            switch (textSize) {
                case "small":
                    return getREM(sizes[8]);
                case "large":
                    return getREM(sizes[6]);
                case "extralarge":
                    return getREM(sizes[4]);
                default:
                    return getREM(sizes[7]);
            }
        };

        const setFontFamily = (fontType) => {
            switch (fontType) {
                case "header":
                    return headerFontFamilies;
                case "code":
                    return codeFontFamily;
                default:
                    return fontFamilies;
            }
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

        const textAlign = align ? `text-align: ${["center", "right"].includes(align) ? align : false};` : "";

        const displayStyle = block ? `display: block;` : `display: inline-block;`;
        const fixedHeight = height ? `height: ${getREM(height)}` : "";

        const styles = `
            color: ${textColor};
            font-family: ${setFontFamily(font)};
            font-size: ${setFontSize(size, fontSizes)};
            font-weight: ${getWeightNumber(weight || "normal")};
            line-height: 1.5;
            ${stateStyle}
            ${uppercaseStyle}
            ${ellipsisStyle}
            ${displayStyle}
            ${fixedHeight}
            ${textAlign}
        `;

        return styles;
    }}
`;

const text = ({
    height,
    size,
    weight,
    state,
    uppercase = false,
    ellipsis = true,
    block = false,
    font = "default",
    align,
    children,
    dataTestId,
    ...props
}: ITextProps) => {
    return (
        <StyledText
            data-testid={dataTestId}
            height={height}
            size={size}
            weight={weight}
            state={state}
            uppercase={uppercase}
            ellipsis={ellipsis}
            block={!!align || block}
            align={align}
            font={font}
            {...props}
        >
            {children}
        </StyledText>
    );
};

export default text;
