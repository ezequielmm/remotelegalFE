import React from "react";

import styled from "styled-components";
import { getREM, getEM, getWeightNumber } from "../../../constants/styles/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface ITitleProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    weight?: "light" | "regular" | "bold";
    ellipsis?: boolean;
    noMargin?: boolean;
    children: string;
}

const StyledHeader = styled.div<ITitleProps>`
    ${({ level, weight, ellipsis, noMargin, theme }) => {
        const {
            textColor,
            headerFontFamily,
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
            color: ${textColor};
            font-family: ${headerFontFamily};
            font-size: ${getREM(fontSizes[level - 1])};
            font-weight: ${weight ? getWeightNumber(weight) : typographyTitleFontWeight};
            line-height: ${lineHeightBase};
            margin-bottom: ${getEM(typographyTitleMarginBottom)};
            ${ellipsisStyle}
            ${noMargin ? "margin: 0;" : ""}
        `;

        return styles;
    }}
`;

const title = ({ level = 1, weight, ellipsis = true, noMargin, children }: ITitleProps) => {
    const headerTag = level ? `h${level}` : "h1";

    return (
        <StyledHeader
            as={headerTag as HeadingTag}
            weight={weight}
            level={level}
            ellipsis={ellipsis}
            noMargin={noMargin}
        >
            {children}
        </StyledHeader>
    );
};

export default title;
