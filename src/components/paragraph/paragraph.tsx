import { Typography } from "antd";
import styled, { CSSObject } from "styled-components";
import React from "react";

const { Paragraph } = Typography;

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    small?: string;
    children: React.ReactNode;
    style?: CSSObject;
}

const StyledWelcomeParagraph = styled(Paragraph)<ParagraphProps>`
    font-family: ${({ small }) => (small ? "Lato, sans-serif" : "Merriweather, serif")};
    font-weight: ${({ small }) => (small ? 300 : 400)};
    font-size: ${({ small }) => (small ? "1rem" : "2.25rem")};
    color: ${({ small }) => (small ? "#72767c" : "#14232e")};
`;

const StyledParagraph = ({ children, small, style }: ParagraphProps) => (
    <StyledWelcomeParagraph style={style} small={small}>
        {children}
    </StyledWelcomeParagraph>
);
export default StyledParagraph;
