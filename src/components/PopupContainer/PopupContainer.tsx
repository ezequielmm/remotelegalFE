import React from "react";
import styled from "styled-components";

export type IPopupContainer = {
    children: React.ReactNode;
    className?: string;
};

const StyledPopupContainer = styled.div<IPopupContainer>`
    display: inline-block;
`;

const PopupContainer = ({ children, className }: IPopupContainer) => {
    return <StyledPopupContainer className={className}>{children}</StyledPopupContainer>;
};

export default PopupContainer;
