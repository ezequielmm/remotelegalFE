import styled from "styled-components";
import { Layout } from "antd";
import Space from "prp-components-library/src/components/Space";
import Card from "prp-components-library/src/components/Card";
import Button from "prp-components-library/src/components/Button";
import backgroundImage from "../../../assets/in-depo/In-depo-bg.png";
import { getREM } from "../../../constants/styles/utils";

export const StyledBlockFirefoxScreen = styled(Layout)`
    min-height: 100vh;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center bottom;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const StyledCard = styled(Card)`
    && {
        padding: ${({ theme }) => getREM(theme.default.spaces[12] * 1.5)}
            ${({ theme }) => getREM(theme.default.spaces[12] * 2.5)};
        width: 100%;

        @media (max-width: ${({ theme }) => theme.default.breakpoints.md}) {
            padding: ${({ theme }) => getREM(theme.default.spaces[6])};
        }
    }
`;

export const StyledSpace = styled(Space)`
    min-width: max-content;
`;

export const StyledButton = styled(Button)`
    min-width: auto;
`;

export const StyledCopyInvitationCard = styled.div`
    padding: ${({ theme }) => getREM(theme.default.spaces[9])};
    background: ${({ theme }) => theme.colors.neutrals[4]};
    border-radius: ${({ theme }) => getREM(theme.default.borderRadiusBase)};
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: ${({ theme }) => getREM(theme.default.spaces[6])};
    }

    @media (max-width: ${({ theme }) => theme.default.breakpoints.md}) {
        flex-direction: column;
        text-align: center;

        > *:not(:last-child) {
            margin-bottom: ${({ theme }) => getREM(theme.default.spaces[6])};
        }
    }
`;
