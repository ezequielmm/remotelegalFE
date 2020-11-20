import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

const flexAlignCenter = `
    display: flex;
    align-items: center;
`;

const iconMargins = `
    & > * {
        margin: 0 6px; // TODO refactor spacing

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
    height: ${({ theme }) => getREM(theme.default.spaces[5] * 3)};
    padding: 0 ${({ theme }) => getREM(theme.default.spaces[3])}; // TODO refactor spacing
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[3]};
    border-top: 1px solid ${({ theme }) => theme.colors.inDepoNeutrals[0]};

    & > * {
        flex: 1 0 0;
    }
`;

export const StyledLogo = styled.div`
    & > * {
        height: ${({ theme }) => getREM(theme.default.spaces[8])}; // TODO refactor spacing
        width: auto;
        display: flex;
    }
`;

export const StyledVideoControls = styled.div`
    ${flexAlignCenter}
    justify-content: center;
    ${iconMargins}
`;

export const StyledGeneralControls = styled.div`
    height: 100%;
    ${flexAlignCenter}
    justify-content: flex-end;
`;

export const StyledPrimaryControls = styled.div`
    ${flexAlignCenter}
    ${iconMargins}
`;

export const StyledSecondaryControls = styled.div`
    height: 100%;
    ${flexAlignCenter}
    ${iconMargins}
    border-left: 1px solid ${({ theme }) => theme.colors.inDepoNeutrals[0]};
    padding-left: 6px; // TODO refactor spacing
    margin-left: 6px; // TODO refactor spacing
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
