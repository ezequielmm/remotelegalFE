import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

const flexAlignCenter = `
    display: flex;
    align-items: center;
`;

const iconMargins = (theme) => `
    & > * {
        margin: 0 ${getREM(theme.default.spaces[3] * theme.default.spaces[4])};

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
`;

export const BreakroomBadge = styled.div`
    color: ${({ theme }) => theme.colors.neutrals[6]};
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[9]};
    border-radius: 2px;
    width: fit-content;
    padding: 3px;
    font-size: 12px;
`;

export const BreakroomDisclaimer = styled.div`
    color: ${({ theme }) => theme.colors.neutrals[6]};
    font-size: 12px;
`;

export const StyledLogo = styled.div`
    & > * {
        height: ${({ theme }) => getREM(theme.default.spaces[8] * 2)};
        width: auto;
        display: flex;
    }
`;

export const BreakroomTitle = styled.div`
    border-left: 1px solid ${({ theme }) => theme.colors.inDepoNeutrals[0]};
    padding-left: ${({ theme }) => getREM(theme.default.spaces[4] * theme.default.spaces[4])};
    margin-left: ${({ theme }) => getREM(theme.default.spaces[3] * theme.default.spaces[4])};
`;

export const StyledLeftControls = styled.div`
    ${flexAlignCenter}
    justify-content: flex-start;
    ${({ theme }) => iconMargins(theme)}
    flex: 2 0 0;
`;

export const StyledVideoControls = styled.div`
    ${flexAlignCenter}
    justify-content: center;
    ${({ theme }) => iconMargins(theme)}
    flex: 1 0 0;
`;

export const StyledGeneralControls = styled.div`
    height: 100%;
    ${flexAlignCenter}
    justify-content: flex-end;
    flex: 2 0 0;
`;

export const StyledPrimaryControls = styled.div`
    ${flexAlignCenter}
    ${({ theme }) => iconMargins(theme)}
`;
