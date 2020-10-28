import styled from "styled-components";
import React from "react";
import { Image } from "antd";
import { getREM } from "../../constants/styles/utils";

const LogoImage = require("../../assets/login/logo.svg");
const BgImage = require("../../assets/login/bg.jpg");

export const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
    background-image: url(${BgImage});
    background-size: cover;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;
export const StyledHeaderSection = styled.section`
    justify-self: center;
    align-self: center;
    @media (max-width: 1024px) {
        padding: ${({ theme }) => getREM(theme.default.spaces[7])};
    }
`;
export const StyledFormContainer = styled.section`
    background: ${({ theme }) => theme.colors.neutrals[4]};
    border-radius: 43px 0 0 43px;
    display: grid;

    @media (min-width: 1024px) {
        overflow-y: auto;

        & > * {
            padding: ${({ theme }) => getREM(theme.default.spaces[11])} 0;
        }
    }

    @media (max-width: 1024px) {
        border-radius: 43px 43px 0 0;
        padding: ${({ theme }) => getREM(theme.default.spaces[7])} 0;
    }
`;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => (
    <StyledContainer>
        <StyledHeaderSection>
            <header>
                <Image src={LogoImage} alt="Remote Legal logo" />
            </header>
        </StyledHeaderSection>
        <StyledFormContainer>{children}</StyledFormContainer>
    </StyledContainer>
);

export default Container;
