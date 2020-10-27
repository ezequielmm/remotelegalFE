import styled from "styled-components";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

interface StyledLinkProps extends LinkProps {
    children?: React.ReactNode;
    to: string;
}

const StyledLinkComponent = styled(Link)<StyledLinkProps>`
    color: #c09853;
    font-family: Lato;
    font-size: 14px;
    font-weight: bold;
`;

const StyledLink = ({ children, to }: StyledLinkProps) => <StyledLinkComponent to={to}>{children}</StyledLinkComponent>;
export default StyledLink;
