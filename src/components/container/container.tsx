import styled from "styled-components";
import React from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

const Image = require("../../assets/login/bg.jpg");

export const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    height: 100vh;
    background-image: url(${Image});
    background-size: cover;
    @media (min-width: 1000px) {
        grid-template-columns: 1fr 1fr;
    }
`;
export const StyledHeaderSection = styled.section`
    justify-self: center;
    align-self: center;
    padding-bottom: 2rem;
    @media (min-width: 1000px) {
        padding-bottom: 0;
    }
`;
export const StyledSubTitleParagraph = styled(Paragraph)`
    font-family: Lato, sans-serif;
    font-weight: 400;
    color: #c69745;
    font-weight: bolder;
    text-align: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 6.6px;
    margin-bottom: 0 !important;
    line-height: 1.5rem;
    @media (min-width: 1000px) {
        font-size: 1rem;
        line-height: normal;
    }
`;

const Header = styled.h1`
    font-family: Merriweather, serif;
    font-weight: 300;
    color: #ffffff;
    font-size: 2rem;
    margin-bottom: 0;
    text-align: center;
    @media (min-width: 1000px) {
        font-size: 3.625rem;
    }
`;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => (
    <StyledContainer>
        <StyledHeaderSection>
            <header>
                <Header>Remote Legal</Header>
                <StyledSubTitleParagraph>Experience the experience</StyledSubTitleParagraph>
            </header>
        </StyledHeaderSection>
        {children}
    </StyledContainer>
);

export default Container;
