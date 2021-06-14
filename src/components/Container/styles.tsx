import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import BgImage from "../../assets/login/bg.jpg";

export const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
    background-image: url(${BgImage});
    background-size: cover;

    @media (max-width: ${theme.default.breakpoints.xl}) {
        grid-template-columns: 1fr;
    }
`;
export const StyledHeaderSection = styled.section`
    justify-self: center;
    align-self: center;
    @media (max-width: ${theme.default.breakpoints.xl}) {
        padding: ${({ theme }) => getREM(theme.default.spaces[12])};
    }
    @media (max-width: ${theme.default.breakpoints.sm}) {
        width: 100%;
        overflow: hidden;
    }
`;
export const StyledFormContainer = styled.section`
    background: ${({ theme }) => theme.colors.neutrals[4]};
    border-radius: 43px 0 0 43px;
    display: grid;

    @media (min-width: ${theme.default.breakpoints.xl}) {
        overflow-y: auto;

        & > * {
            padding: ${({ theme }) => getREM(theme.default.spaces[6] * 4)} 0;
        }
    }

    @media (max-width: ${theme.default.breakpoints.xl}) {
        border-radius: 43px 43px 0 0;
        padding: ${({ theme }) => getREM(theme.default.spaces[12])} 0;
    }
`;
