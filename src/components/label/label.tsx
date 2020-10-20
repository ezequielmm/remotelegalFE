import styled from "styled-components";
import React from "react";

const StyledLabel = styled.label`
    text-transform: uppercase;
    font-size: 12px !important;
    font-family: Lato;
    margin-bottom: 0.5rem;
    display: block;
    color: #14232e;
    font-weight: 400;
`;
interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    htmlFor?: string;
}
const Label = ({ children }: LabelProps) => <StyledLabel> {children}</StyledLabel>;
export default Label;
