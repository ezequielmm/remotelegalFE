import React from "react";
import Logo from "../Logo";
import { getREM } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
import { StyledContainer, StyledHeaderSection, StyledFormContainer } from "./styles";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => (
    <StyledContainer>
        <StyledHeaderSection>
            <header>
                <a href="/">
                    <Logo version="light" width={getREM(theme.default.spaces[8] * 20)} />
                </a>
            </header>
        </StyledHeaderSection>
        <StyledFormContainer>{children}</StyledFormContainer>
    </StyledContainer>
);

export default Container;
