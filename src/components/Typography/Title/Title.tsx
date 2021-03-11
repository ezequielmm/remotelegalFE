import React from "react";

import styled from "styled-components";
import { getREM, getEM, getWeightNumber } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface ITitleProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    weight?: "light" | "regular" | "bold";
    color?: ColorStatus;
    ellipsis?: boolean;
    noMargin?: boolean;
    children: string;
    dataTestId?: string;
    textAlign?: "left" | "center" | "right";
}

const StyledHeader = styled.div<ITitleProps>`
    ${({ level, weight, color, ellipsis, noMargin, theme, textAlign }) => {
        const {
            textColor,
            headerFontFamilies,
            fontSizes,
            lineHeightBase,
            typographyTitleFontWeight,
            typographyTitleMarginBottom,
        } = theme.default;

        const ellipsisStyle = ellipsis
            ? `
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-wrap: normal;
            `
            : "";

        const styles = `
            color: ${theme.default[`${color}Color`] || textColor};
            font-family: ${headerFontFamilies};
            font-size: ${getREM(fontSizes[level - 1])};
            font-weight: ${weight ? getWeightNumber(weight) : typographyTitleFontWeight};
            line-height: ${lineHeightBase};
            margin-bottom: ${getEM(typographyTitleMarginBottom)};
            ${ellipsisStyle}
            ${noMargin ? "margin: 0!important;" : ""}
            ${textAlign ? `text-align: ${textAlign}` : ""}
        `;

        return styles;
    }}
`;

const title = ({
    level = 1,
    weight,
    color,
    ellipsis = true,
    noMargin,
    children,
    dataTestId,
    textAlign,
}: ITitleProps) => {
    const headerTag = level ? `h${level}` : "h1";

    return (
        <StyledHeader
            data-testid={dataTestId}
            as={headerTag as HeadingTag}
            level={level}
            weight={weight}
            color={color}
            ellipsis={ellipsis}
            noMargin={noMargin}
            textAlign={textAlign}
        >
            {children}
        </StyledHeader>
    );
};

export default title;
