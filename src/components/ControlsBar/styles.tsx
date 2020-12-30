import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

const flexAlignCenter = `
    display: flex;
    align-items: center;
`;

const iconMargins = (theme) => `
    & > * {
        margin: 0 ${getREM(theme.default.spaces[3] * theme.default.spaces[4])}; // 0.375

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }
`;

export const StyledContainer = styled.div`
    ${flexAlignCenter}
    height: ${({ theme }) => getREM(theme.default.spaces[7] * 4)};
    padding: 0 ${({ theme }) => getREM(theme.default.spaces[6])};
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[3]};
    border-top: 1px solid ${({ theme }) => theme.colors.inDepoNeutrals[0]};

    & > * {
        flex: 1 0 0;
    }
`;

export const StyledLogo = styled.div`
    & > * {
        height: ${({ theme }) => getREM(theme.default.spaces[8] * 2)};
        width: auto;
        display: flex;
    }
`;

export const StyledVideoControls = styled.div`
    ${flexAlignCenter}
    justify-content: center;
    ${({ theme }) => iconMargins(theme)}
`;

export const StyledGeneralControls = styled.div`
    height: 100%;
    ${flexAlignCenter}
    justify-content: flex-end;
`;

export const StyledPrimaryControls = styled.div`
    ${flexAlignCenter}
    ${({ theme }) => iconMargins(theme)}
`;

export const StyledSecondaryControls = styled.div`
    height: 100%;
    ${flexAlignCenter}
    ${({ theme }) => iconMargins(theme)}
    border-left: 1px solid ${({ theme }) => theme.colors.inDepoNeutrals[0]};
    padding-left: ${({ theme }) => getREM(theme.default.spaces[3] * theme.default.spaces[4])}; // 0.375
    margin-left: ${({ theme }) => getREM(theme.default.spaces[3] * theme.default.spaces[4])}; // 0.375
`;

export const StyledComposedIconContainer = styled.div`
    ${flexAlignCenter}

    & > * {
        margin: 0 -0.1em;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }
`;
