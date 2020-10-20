import styled, { CSSObject } from "styled-components";
import React from "react";

interface ErrorParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    style?: CSSObject;
}

const StyledParagraph = styled.p<ErrorParagraphProps>`
    color: #ff4d4f;
    margin: 0;
    min-height: 24px;
`;

const ErrorParagraph = ({ children, style }: ErrorParagraphProps) => (
    <StyledParagraph style={style}>{children}</StyledParagraph>
);
export default ErrorParagraph;
