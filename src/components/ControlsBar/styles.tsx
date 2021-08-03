import styled from "styled-components";
import { Drawer } from "antd";
import Menu from "prp-components-library/src/components/Menu";
import Button from "prp-components-library/src/components/Button";
import Space from "prp-components-library/src/components/Space";
import { getREM } from "../../constants/styles/utils";
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
        .ant-btn-link .anticon{
            margin-right: 0;
        }
    `}
`;

export const StyledMoreWrapper = styled.div`
    position: absolute;
    bottom: 0;
    height: 100%;
    display: flex;
    align-items: center;
    ${({ theme }) => `
        right: ${getREM(theme.default.spaces[6])};
    `}
`;

export const StyledDrawer = styled(Drawer)`
    ${({ theme }) => `
        .ant-drawer-content {
            background-color: ${theme.colors.inDepoNeutrals[3]};
            border-radius: ${getREM(theme.default.spaces[6])} ${getREM(theme.default.spaces[6])} 0 0;
        }
        .ant-drawer-footer{
            border-top: 0;
            padding-top: 0;
        }
    `}
`;

export const StyledDrawerSpace = styled(Space)`
    .ant-btn {
        margin: auto;
    }
`;

export const StyledEndButton = styled(Button)`
    width: 100%;
    justify-content: center;
    ${({ theme }) => `
        background-color: ${theme.default.errorColor};
        border-color: ${theme.default.errorColor};
        color: ${theme.default.whiteColor};
        path {
            fill: ${theme.default.whiteColor};
        }
        &:active, &:focus, &:hover{
            background-color: ${theme.colors.inDepoRed[6]};
            border-color: ${theme.colors.inDepoRed[6]};
            color: ${theme.default.whiteColor};
        }
    `}
`;

export const StyledMobileMenu = styled(Menu)`
    &.ant-menu-dark {
        background-color: transparent;
    }
    ${({ theme }) => `
        .ant-menu-item {
            background-color: ${theme.colors.inDepoNeutrals[3]};
            border: 1px solid ${theme.colors.inDepoNeutrals[1]} !important;
            padding: 0 ${getREM(theme.default.spaces[9])};
            border-radius: ${getREM(theme.default.spaces[4])};
            margin-bottom: ${getREM(theme.default.spaces[3])} !important;
            height: ${getREM(theme.default.spaces[12] * 2)}
        }
    `}
`;

export const StyledTagSpace = styled.div`
    position: absolute;
    bottom: 0;
    height: 100%;
    display: flex;
    align-items: center;
    height: 100%;
    ${({ theme }) => `
        left: ${getREM(theme.default.spaces[6])};
    `}
`;
