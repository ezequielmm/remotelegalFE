import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

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
    @media (max-width: 576px) {
        width: 100%;
        overflow: hidden;
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
