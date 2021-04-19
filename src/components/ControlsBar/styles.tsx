import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import Space from "../Space";
import Menu from "../Menu";
import { ThemeMode } from "../../types/ThemeType";

const flexAlignCenter = `
    display: flex;
    align-items: center;
`;

export const StyledContainer = styled(Space)`
    height: ${({ theme }) => getREM(theme.default.spaces[7] * 4)};
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[3]};
    border-top: 1px solid ${({ theme }) => theme.colors.inDepoNeutrals[0]};
`;

export const StyledLogo = styled.div`
    & > * {
        height: ${({ theme }) => getREM(theme.default.spaces[8] * 2)};
        width: auto;
        display: flex;
    }
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

export const LockedMenuItem = styled(Menu.Item)`
    ${({ theme }) => `
        background-color: ${theme.mode === ThemeMode.default ? theme.colors.neutrals[5] : theme.colors.secondary[6]};
        &:hover{
            background-color: ${
                theme.mode === ThemeMode.default ? theme.colors.neutrals[5] : theme.colors.secondary[6]
            } !important;
        }
    `}
`;
